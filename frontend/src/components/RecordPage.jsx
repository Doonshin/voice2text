import { useEffect, useState } from "react";
import { uploadAudioFile } from "../api";

export default function RecordPage({ onBack, onRecorded }) {
  const [permission, setPermission] = useState("checking");
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e) =>
          setChunks((prev) => [...prev, e.data]);

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], "recording.webm", { type: "audio/webm" });

          setStatus("Uploading...");

          try {
            // FIXED — correct function call
            const meta = await uploadAudioFile(file);
            onRecorded(meta);
          } catch (err) {
            setStatus("Upload failed: " + err.message);
          }

          setChunks([]);
        };

        setRecorder(mediaRecorder);
        setPermission("granted");
      })
      .catch(() => setPermission("denied"));
  }, []);

  const handleRecord = () => {
    if (!recorder) return;

    if (!recording) {
      setStatus("Recording...");
      recorder.start();
      setRecording(true);
    } else {
      recorder.stop();
      setRecording(false);
    }
  };

  if (permission === "checking") {
    return (
      <div className="phone-frame">
        <div className="header">Microphone access</div>
        <p className="subtext">Checking permission...</p>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="phone-frame">
        <div className="header">Microphone blocked</div>
        <p className="subtext">
          Please allow microphone access in browser settings & reload.
        </p>
        <button className="button secondary" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="phone-frame">
      <div className="nav-bar">
        <span className="nav-link" onClick={onBack}>
          ← Back
        </span>
      </div>

      <div className="header">Live Transcript</div>

      <p className="subtext" style={{ marginBottom: 8 }}>
        Press record, then stop to upload & transcribe.
      </p>

      <div className="textarea-box">
        <span className="subtext">{status}</span>
      </div>

      <div className="bottom-actions">
        <button className="button round" onClick={handleRecord}>
          {recording ? "Stop" : "Record"}
        </button>
      </div>
    </div>
  );
}
