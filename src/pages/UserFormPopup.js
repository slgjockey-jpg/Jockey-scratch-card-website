import React, { useEffect, useMemo, useState } from "react";
import "./UserFormPopup.css";

export default function UserFormPopup({ onClose, onSubmit, existingMobile }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const cleanMobile = useMemo(() => mobile.replace(/\D/g, "").slice(0, 10), [mobile]);

  useEffect(() => {
    setError("");
  }, [name, mobile]);

  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nm = name.trim();
    const mb = cleanMobile;

    if (!nm) {
      setError("Please enter your name");
      return;
    }

    if (!isValidMobile(mb)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (existingMobile && existingMobile === mb) {
      setError("This mobile number is already used");
      return;
    }

    onSubmit({ name: nm, mobile: mb });
  };

  return (
    <div className="uf-overlay" onClick={onClose}>
      <div className="uf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uf-top">
          <h2 className="uf-title">Fill the Form</h2>
          <button className="uf-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="uf-subtitle">Enter your details to unlock the next step</p>

        <form className="uf-form" onSubmit={handleSubmit}>
          <div className="uf-field">
            <label className="uf-label">Name</label>
            <input
              className="uf-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>

          <div className="uf-field">
            <label className="uf-label">Mobile Number</label>
            <input
              className="uf-input"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              inputMode="numeric"
              maxLength={10}
            />
          </div>

          {error ? <div className="uf-error">{error}</div> : null}

          <div className="uf-actions">
            <button type="button" className="uf-btn uf-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="uf-btn uf-btn-primary">
              Submit
            </button>
          </div>

          <p className="uf-note">
            Your mobile number is used only to prevent duplicate entries.
          </p>
        </form>
      </div>
    </div>
  );
}
