import { useState } from "react";
import { summarize, processLatest } from "../api";

export default function TranscriptPage({ file, onBack }) {
  // local mutable file state
  const [localFile, setLocalFile] = useState(file);
  const [activeTab, setActiveTab] = useState("transcript");
  const [processing, setProcessing] = useState(false);

  // Run transcription
  const handleProcess = async () => {
    setProcessing(true);
    try {
      const result = await processLatest();

      // update transcript in UI immediately
      setLocalFile(prev => ({
        ...prev,
        transcript: result.text,
        summary: "Ready — run summarization"
      }));
    } catch (err) {
      alert("Processing failed");
    }
    setProcessing(false);
  };

  // Run summarization
  const handleSummarize = async () => {
    setProcessing(true);
    try {
      const summary = await summarize(localFile.id);

      // instantly update UI
      setLocalFile(prev => ({
        ...prev,
        summary
      }));
    } catch (err) {
      alert("Summarization failed");
    }
    setProcessing(false);
  };

  const displayedText =
    activeTab === "transcript"
      ? localFile.transcript || "Transcript not available — run processing"
      : localFile.summary || "No summary generated";

  return (
    <div className="phone-frame">
      <div className="nav-bar">
        <span className="nav-link" onClick={onBack}>← Back</span>
      </div>

      <div className="header">{localFile.name}</div>

      {/* Tabs */}
      <div className="tab-switcher">
        <button
          className={activeTab === "transcript" ? "tab active" : "tab"}
          onClick={() => setActiveTab("transcript")}
        >
          Transcript
        </button>
        <button
          className={activeTab === "summary" ? "tab active" : "tab"}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
      </div>

      {/* Display text */}
      <div className="text-display">{displayedText}</div>

      {/* Copy / Export */}
      <div className="action-bar-centered">
        <button
          className="button secondary"
          onClick={() => navigator.clipboard.writeText(displayedText)}
          style={{ minWidth: 120 }}
        >
          Copy
        </button>

        <button
          className="button secondary"
          onClick={() => alert("Export feature coming soon")}
          style={{ minWidth: 120 }}
        >
          Export
        </button>
      </div>

      {/* Bottom action */}
      <div className="bottom-actions">
        {activeTab === "transcript" ? (
          <button
            className="button primary"
            onClick={handleProcess}
            disabled={processing}
            style={{ width: 220 }}
          >
            {processing ? "Processing..." : "Run Transcription"}
          </button>
        ) : (
          <button
            className="button primary"
            onClick={handleSummarize}
            disabled={processing}
            style={{ width: 220 }}
          >
            {processing ? "Summarizing..." : "Run Summarization"}
          </button>
        )}
      </div>
    </div>
  );
}
