const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// ---- AUTH ----
export async function login(email, password) {
  try {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  } catch (err) {
    console.error("API login error:", err);
    throw err;
  }
}

// ---- FILE LIST ----
export async function fetchFiles() {
  try {
    const res = await fetch(`${BASE}/files`);
    if (!res.ok) throw new Error("Failed to load file list");
    return await res.json();
  } catch (err) {
    console.error("API fetchFiles error:", err);
    throw err;
  }
}

// ---- FILE UPLOAD ----
export async function uploadAudioFile(file) {
  try {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${BASE}/transcribe`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (err) {
    console.error("API upload error:", err);
    throw err;
  }
}

// alias — keeps compatibility
export async function uploadAudio(file) {
  return uploadAudioFile(file);
}

// ---- RUN SPEECH-TO-TEXT ----
export async function processLatest() {
  try {
    const res = await fetch(`${BASE}/process-latest`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Processing failed");
    return await res.json();
  } catch (err) {
    console.error("API processLatest error:", err);
    throw err;
  }
}

// ---- NEW 🔥 RUN SUMMARIZATION ----
export async function summarize(transcript_id) {
  try {
    const res = await fetch(`${BASE}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript_id }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.detail || "Failed to summarize");
    }

    // return full response OR just summary text
    return data.summary;
  } catch (err) {
    console.error("API summarize error:", err);
    throw err;
  }
}
