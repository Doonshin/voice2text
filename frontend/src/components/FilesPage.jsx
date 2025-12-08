import { useEffect, useState } from "react";
import { fetchFiles, uploadAudioFile } from "../api";

export default function FilesPage({ onBack, onOpenFile }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function loadFiles() {
    try {
      const data = await fetchFiles();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Load failed", err);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  // 📌 Hidden input handler
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadAudioFile(file);
      setTimeout(loadFiles, 500);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="phone-frame">
      {/* Back */}
      <div className="nav-bar">
        <span className="nav-link" onClick={onBack}>
          ← Back
        </span>
      </div>

      {/* Title */}
      <div className="header">My Files</div>

      {/* Upload Link */}
      <label
        htmlFor="fileUpload"
        style={{
          fontWeight: 500,
          cursor: "pointer",
          color: "#007bff",
          display: "inline-block",
          marginBottom: 15
        }}
      >
        + Upload
      </label>

      <input
        id="fileUpload"
        type="file"
        style={{ display: "none" }}
        accept=".wav,.mp3,.m4a,.webm"
        onChange={handleFileSelect}
      />

      {/* File List */}
      <div style={{ marginTop: 8 }}>
        {files.length === 0 && (
          <p className="subtext">No files uploaded yet.</p>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="file-row"
            onClick={() => onOpenFile(file)}
            style={{
              cursor: "pointer",
              paddingBottom: 10,
              borderBottom: "1px solid #eee",
              marginBottom: 10
            }}
          >
            <strong>{file.name}</strong>
            <div className="subtext">
              {new Date(file.created_at).toLocaleString()} •{" "}
              {file.summary ? "Processed" : "Not processed"}
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {uploading && <div className="toast">Uploading...</div>}
    </div>
  );
}
