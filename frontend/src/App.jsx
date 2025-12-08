import { useState } from "react";
import "./styles.css";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RecordPage from "./components/RecordPage";
import TranscriptPage from "./components/TranscriptPage";
import FilesPage from "./components/FilesPage";
import SettingsPage from "./components/SettingsPage";
import { uploadAudioFile } from "./api";   // <-- NEW

const SCREENS = {
  LOGIN: "login",
  HOME: "home",
  RECORD: "record",
  TRANSCRIPT: "transcript",
  FILES: "files",
  SETTINGS: "settings"
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [user, setUser] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

  const handleLogin = (data) => {
    setUser(data);
    setScreen(SCREENS.HOME);
  };

  // ⚡ Upload handler — runs backend upload API
  async function handleUpload(file) {
    try {
      await uploadAudioFile(file);
      alert("Uploaded successfully! Go to My Files to process.");
      setScreen(SCREENS.FILES);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  }

  const openFile = (f) => {
    setActiveFile(f);
    setScreen(SCREENS.TRANSCRIPT);
  };

  if (!user || screen === SCREENS.LOGIN) {
    return (
      <div className="app-root">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-root">
      {screen === SCREENS.HOME && (
        <HomePage
          username={user.username}
          onSelectRecord={() => setScreen(SCREENS.RECORD)}
          onSelectUpload={handleUpload}   // <-- FIXED HERE
          onGoSettings={() => setScreen(SCREENS.SETTINGS)}
          onGoFiles={() => setScreen(SCREENS.FILES)}
        />
      )}

      {screen === SCREENS.RECORD && (
        <RecordPage
          onBack={() => setScreen(SCREENS.HOME)}
          onRecorded={openFile}
        />
      )}

      {screen === SCREENS.TRANSCRIPT && activeFile && (
        <TranscriptPage
          file={activeFile}
          onBack={() => setScreen(SCREENS.HOME)}
        />
      )}

      {screen === SCREENS.FILES && (
        <FilesPage
          onBack={() => setScreen(SCREENS.HOME)}
          onOpenFile={openFile}
        />
      )}

      {screen === SCREENS.SETTINGS && (
        <SettingsPage
          username={user.username}
          onBack={() => setScreen(SCREENS.HOME)}
          onLogout={() => {
            setUser(null);
            setScreen(SCREENS.LOGIN);
          }}
        />
      )}
    </div>
  );
}
