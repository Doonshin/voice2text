import { useRef } from "react";

export default function HomePage({
  username,
  onSelectRecord,
  onSelectUpload,
  onGoSettings,
  onGoFiles
}) {
  const hiddenUploadRef = useRef(null);

  const triggerFilePicker = () => {
    hiddenUploadRef.current?.click();
  };

  const handleFileChosen = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await onSelectUpload(file);

    alert("Uploaded successfully! Opening My Files…");

    onGoFiles();
  };

  return (
    <div className="phone-frame">
      {/* Settings link */}
      <div className="nav-bar" style={{ justifyContent: "flex-end" }}>
        <span className="nav-link" onClick={onGoSettings}>
          Settings
        </span>
      </div>

      {/* Greeting */}
      <div className="header">Hi, {username}</div>

      {/* Subtitle */}
      <div className="subtext" style={{ fontSize: 16, marginTop: -10, marginBottom: 18 }}>
        Upload or Record
      </div>

      {/* Instruction text */}
      <p
        className="subtext"
        style={{
          marginBottom: 30,
          lineHeight: 1.4,
          maxWidth: "80%"
        }}
      >
        Choose how you want to capture audio to transcribe and summarize.
      </p>

      {/* Action buttons - Centered with equal width */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          marginBottom: 30
        }}
      >
        <button
          className="button secondary"
          onClick={triggerFilePicker}
          style={{
            padding: "12px 18px",
            minWidth: 140,
            textAlign: "center"
          }}
        >
          Choose File
        </button>

        <button
          className="button primary"
          onClick={onSelectRecord}
          style={{
            padding: "12px 18px",
            minWidth: 140,
            textAlign: "center"
          }}
        >
          Start
        </button>
      </div>

      {/* Hidden File Picker */}
      <input
        type="file"
        ref={hiddenUploadRef}
        accept=".wav,.mp3,.m4a,.webm"
        style={{ display: "none" }}
        onChange={handleFileChosen}
      />

      {/* My Files button pinned bottom */}
      <div className="bottom-actions">
        <button className="button secondary" onClick={onGoFiles}>
          My Files
        </button>
      </div>
    </div>
  );
}

