import React, { useState } from "react";
import "./MainForm.css";
import UserFormPopup from "./UserFormPopup";

export default function MainForm() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [error, setError] = useState("");

  const step2Active = isFormSubmitted;
  const step3Active = isFormSubmitted && isFeedbackDone;

  const getUsedMobiles = () => {
    try {
      return JSON.parse(localStorage.getItem("used_mobiles") || "[]");
    } catch {
      return [];
    }
  };

  const storeMobile = (mobile) => {
    const used = getUsedMobiles();
    const updated = Array.from(new Set([...used, mobile]));
    localStorage.setItem("used_mobiles", JSON.stringify(updated));
  };

  const handleOpenForm = () => {
    setError("");
    setShowFormPopup(true);
  };

  const handleFormSubmit = ({ name, mobile }) => {
    const used = getUsedMobiles();

    if (used.includes(mobile)) {
      setError("This mobile number is already used");
      return;
    }

    storeMobile(mobile);
    localStorage.setItem("jockey_user", JSON.stringify({ name, mobile }));

    setIsFormSubmitted(true);
    setIsFeedbackDone(false);
    setShowFormPopup(false);
    setError("");
  };

  const handleFeedback = () => {
    window.open("https://www.google.com/maps", "_blank", "noopener,noreferrer");
    setIsFeedbackDone(true);
  };

  const handleScratch = () => {
    window.location.href = "/scratch";
  };

  return (
    <div className="jf-wrap">
      <div className="jf-bubbles">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className="jf-bubble" style={{ "--i": i + 1 }} />
        ))}
      </div>

      <div className="jf-rings">
        <span className="jf-ring jf-ring-1" />
        <span className="jf-ring jf-ring-2" />
        <span className="jf-ring jf-ring-3" />
      </div>

      {showFormPopup ? (
        <UserFormPopup onClose={() => setShowFormPopup(false)} onSubmit={handleFormSubmit} />
      ) : null}

      <div className="jf-card jf-form-only">
        <h1 className="jf-heading">SGL JOCKEY</h1>
        <div className="jf-underline" />

        {error ? <div className="jf-error">{error}</div> : null}

        <div className="jf-actions">
          <div className="jf-action-block">
            <div className="jf-step">
              <div className={`jf-step-dot ${isFormSubmitted ? "done" : "active"}`} />
              <p className="jf-step-text">{isFormSubmitted ? "Completed" : "Step 1"}</p>
            </div>

            <button className="jf-btn jf-btn-primary" onClick={handleOpenForm} disabled={isFormSubmitted}>
              {isFormSubmitted ? "Form Submitted" : "Fill the Form"}
            </button>

            <p className="jf-hint">Submit your name and mobile number to unlock the next step.</p>
          </div>

          <div className={`jf-action-block ${step2Active ? "" : "jf-disabled"}`}>
            <div className="jf-step">
              <div className={`jf-step-dot ${isFeedbackDone ? "done" : step2Active ? "active" : ""}`} />
              <p className="jf-step-text">{isFeedbackDone ? "Completed" : "Step 2"}</p>
            </div>

            <button
              className={`jf-btn ${step2Active ? "jf-btn-secondary" : "jf-btn-locked"}`}
              onClick={step2Active ? handleFeedback : undefined}
              disabled={!step2Active || isFeedbackDone}
            >
              {isFeedbackDone ? "Feedback Opened" : "Give the Feedback"}
            </button>

            <p className="jf-hint">Google Maps will open in a new tab. Then scratch will unlock.</p>
          </div>

          <div className={`jf-action-block ${step3Active ? "" : "jf-disabled"}`}>
            <div className="jf-step">
              <div className={`jf-step-dot ${step3Active ? "active" : ""}`} />
              <p className="jf-step-text">Step 3</p>
            </div>

            <button
              className={`jf-btn ${step3Active ? "jf-btn-gradient" : "jf-btn-locked"}`}
              onClick={step3Active ? handleScratch : undefined}
              disabled={!step3Active}
            >
              Scratch & Win
            </button>

            <p className="jf-hint">Reveal your reward once the previous steps are done.</p>
          </div>
        </div>

        <div className="jf-footer">
          <p className="jf-footer-text">Powered by Jockey Rewards</p>
        </div>
      </div>
    </div>
  );
}
