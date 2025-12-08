import { useState } from "react";

export default function SettingsPage({ username, onBack, onLogout }) {
  const [dark, setDark] = useState(false);

  return (
    <div className="phone-frame">
      <div className="nav-bar">
        <span className="nav-link" onClick={onBack}>
          ← Back
        </span>
        <span className="nav-link" onClick={onLogout}>
          Log out
        </span>
      </div>

      <div className="header">Profile & Settings</div>

      <div className="settings-item">
        <div className="subtext" style={{ marginBottom: 4 }}>
          Username
        </div>
        <div>{username}</div>
      </div>

      <div className="settings-item">Account</div>
      <div className="settings-item">Subscription</div>

      <div className="settings-item">
        <div className="toggle-row">
          <span>Dark Mode</span>
          <div
            className={`toggle-pill ${dark ? "on" : ""}`}
            onClick={() => setDark((v) => !v)}
          >
            <div className="toggle-knob" />
          </div>
        </div>
      </div>
    </div>
  );
}
