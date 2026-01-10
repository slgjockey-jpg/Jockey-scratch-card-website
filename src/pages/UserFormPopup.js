import React, { useEffect, useMemo, useState } from "react";
import "./UserFormPopup.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://jockey-scratch-card-backend.vercel.app";

export default function UserFormPopup({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanMobile = useMemo(
    () => mobile.replace(/\D/g, "").slice(0, 10),
    [mobile]
  );

  useEffect(() => {
    setError("");
  }, [name, mobile]);

  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

  const checkCustomer = async (mb) => {
    const res = await fetch(`${API_BASE_URL}/api/check-customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: mb }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    return data.exists;
  };

  const saveEntry = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/api/save-entry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nm = name.trim();
    const mb = cleanMobile;

    if (!nm) return setError("Please enter your name");
    if (!isValidMobile(mb)) return setError("Enter a valid 10-digit mobile number");

    setLoading(true);
    setError("");

    try {
      const exists = await checkCustomer(mb);
      if (exists) {
        setLoading(false);
        return setError("This mobile number is already used");
      }

      await saveEntry({ name: nm, mobile: mb });

      setLoading(false);
      onSubmit({ name: nm, mobile: mb });
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="uf-overlay" onClick={loading ? undefined : onClose}>
      <div className="uf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uf-glow uf-glow-a" />
        <div className="uf-glow uf-glow-b" />

        <div className="uf-top">
          <div className="uf-title-wrap">
            <h2 className="uf-title">Customer Details</h2>
            <p className="uf-subtitle">Enter your name and mobile to continue</p>
          </div>

          <button
            className="uf-close"
            onClick={loading ? undefined : onClose}
            aria-label="Close"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form className="uf-form" onSubmit={handleSubmit}>
          <div className="uf-field">
            <label className="uf-label">Name</label>
            <input
              className="uf-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="uf-field">
            <label className="uf-label">Mobile Number</label>
            <input
              className="uf-input"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile"
              inputMode="numeric"
              maxLength={10}
              disabled={loading}
            />
          </div>

          {error ? <div className="uf-error">{error}</div> : null}

          <div className="uf-actions">
            <button
              type="button"
              className="uf-btn uf-btn-ghost"
              onClick={loading ? undefined : onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="uf-btn uf-btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
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
