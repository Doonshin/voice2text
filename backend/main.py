from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import speech
import tempfile
import subprocess
import os

from openai import OpenAI

from models import FILES_DB, FileRecord, TranscriptList
from dotenv import load_dotenv
import os

load_dotenv()



# ---- Create OpenAI client ----
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Upload endpoint ----
@app.post("/api/transcribe")
async def upload_audio(file: UploadFile = File(...)):
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp:
        content = await file.read()
        temp.write(content)
        saved_path = temp.name

    record = FileRecord(file.filename, saved_path)
    FILES_DB.append(record)

    return {"success": True, "message": "File uploaded"}


# ---- Speech-to-text processing ----
@app.post("/api/process-latest")
async def process_latest():
    if not FILES_DB:
        raise HTTPException(status_code=400, detail="No files uploaded")

    latest = sorted(FILES_DB, key=lambda x: x.created_at)[-1]

    try:
        client_speech = speech.SpeechClient()

        # Convert audio to mono 16kHz FLAC for Google Speech
        flac_file = latest.path + ".flac"
        subprocess.run([
            "ffmpeg",
            "-y",
            "-i", latest.path,
            "-ac", "1",
            "-ar", "16000",
            flac_file
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        with open(flac_file, "rb") as f:
            audio_bytes = f.read()

        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
            language_code="en-US",
            sample_rate_hertz=16000,
        )

        response = client_speech.recognize(config=config, audio=audio)

        text_output = " ".join(
            result.alternatives[0].transcript
            for result in response.results
        )

        latest.text = text_output or "(No speech detected)"
        latest.summary = "Ready — run summarization"

        return {"success": True, "text": latest.text}

    except Exception as e:
        latest.summary = "Failed"
        return {"success": False, "error": str(e)}


# ---- Get all files ----
@app.get("/api/files", response_model=TranscriptList)
async def get_files():
    return TranscriptList(files=[f.to_meta() for f in FILES_DB])


# ---- Summarization using OpenAI ----
@app.post("/api/summarize")
async def summarize_text(payload: dict):
    transcript_id = payload.get("transcript_id")

    file = next((f for f in FILES_DB if str(f.id) == str(transcript_id)), None)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if not file.text or len(file.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="No transcript available")

    prompt = f"""
    Create a clean, readable summary of the speech below.
    Keep it short but meaningful. Avoid repetition.

    Transcript:
    {file.text}
    """

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a summarization assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        summary = completion.choices[0].message.content.strip()

        # Save result
        file.summary = summary

        return {"success": True, "summary": summary}

    except Exception as e:
        print("Summarization error:", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to summarize — check OpenAI API setup"
        )
