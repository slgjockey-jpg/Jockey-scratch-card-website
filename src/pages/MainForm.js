import React, { useEffect, useMemo, useState } from "react";
import "./MainForm.css";
import UserFormPopup from "./UserFormPopup";
import WelcomePopup from "./WelcomePopup";

export default function MainForm() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFeedbackDone, setIsFeedbackDone] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const step2Active = isFormSubmitted;
  const step3Active = isFormSubmitted && isFeedbackDone;

  const reviewUrl =
    "https://maps.app.goo.gl/QHL3N2aS8rMbSrzq6?g_st=ic";

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("jockey_user") || "null");
    } catch {
      return null;
    }
  }, [isFormSubmitted]);

  useEffect(() => {
    const reset = localStorage.getItem("jockey_reset") === "1";

    if (reset) {
      localStorage.removeItem("jockey_reset");
      setIsFormSubmitted(false);
      setIsFeedbackDone(false);
      setShowFormPopup(false);
      setError("");
      setSuccessMsg("");
      setShowWelcome(true);
      return;
    }

    const feedbackDone = localStorage.getItem("jockey_feedback_done") === "1";
    if (user?.mobile) setIsFormSubmitted(true);
    if (feedbackDone) setIsFeedbackDone(true);

    setShowWelcome(true);
  }, []);

  useEffect(() => {
    if (!showWelcome) return;
    const t = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(t);
  }, [showWelcome]);

  const handleOpenForm = () => {
    setError("");
    setSuccessMsg("");
    setShowFormPopup(true);
  };

  const handleFormSubmit = ({ name, mobile }) => {
    localStorage.setItem("jockey_user", JSON.stringify({ name, mobile }));
    setIsFormSubmitted(true);
    setIsFeedbackDone(false);
    localStorage.removeItem("jockey_feedback_done");
    setShowFormPopup(false);
    setError("");
    setSuccessMsg("Successfully submitted");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleFeedback = () => {
    window.open(reviewUrl, "_blank", "noopener,noreferrer");
    localStorage.setItem("jockey_feedback_done", "1");
    setIsFeedbackDone(true);
  };

  const handleScratch = () => {
    window.location.href = "/scratch";
  };

  return (
    <div className="mf-wrap">
      <div className="mf-glow mf-glow-left" />
      <div className="mf-glow mf-glow-right" />

      <WelcomePopup show={showWelcome} />

      {showFormPopup ? (
        <UserFormPopup
          onClose={() => setShowFormPopup(false)}
          onSubmit={handleFormSubmit}
        />
      ) : null}

      <div className="mf-shell">
        <div className="mf-hero">
          <div className="mf-badge">SLG JOCKEY</div>
          <h1 className="mf-title">Scratch and Win Rewards</h1>
          <p className="mf-subtitle">Complete the steps below to unlock your scratch card.</p>
        </div>

        {error ? <div className="mf-alert mf-alert-error">{error}</div> : null}
        {successMsg ? <div className="mf-alert mf-alert-success">{successMsg}</div> : null}

        <div className="mf-steps">
          <div className={`mf-step ${isFormSubmitted ? "done" : "active"}`}>
            <div className="mf-step-head">
              <div className={`mf-dot ${isFormSubmitted ? "done" : "active"}`} />
              <div className="mf-step-texts">
                <div className="mf-step-title">Step 1</div>
                <div className="mf-step-desc">Submit your name and mobile</div>
              </div>
              <div className="mf-status">{isFormSubmitted ? "Completed" : "Pending"}</div>
            </div>

            {user?.name && user?.mobile ? (
              <div className="mf-userline">
                <span className="mf-userpill">{user.name}</span>
                <span className="mf-userpill">{user.mobile}</span>
              </div>
            ) : null}

            <button
              className={`mf-btn ${isFormSubmitted ? "mf-btn-done" : "mf-btn-primary"}`}
              onClick={handleOpenForm}
              disabled={isFormSubmitted}
            >
              {isFormSubmitted ? "Completed" : "Fill the Form"}
            </button>
          </div>

          <div className={`mf-step ${step2Active ? (isFeedbackDone ? "done" : "active") : "locked"}`}>
            <div className="mf-step-head">
              <div className={`mf-dot ${isFeedbackDone ? "done" : step2Active ? "active" : ""}`} />
              <div className="mf-step-texts">
                <div className="mf-step-title">Step 2</div>
                <div className="mf-step-desc">Leave a review on Google</div>
              </div>
              <div className="mf-status">{isFeedbackDone ? "Completed" : step2Active ? "Ready" : "Locked"}</div>
            </div>

            <button
              className={`mf-btn ${step2Active ? "mf-btn-secondary" : "mf-btn-locked"}`}
              onClick={step2Active && !isFeedbackDone ? handleFeedback : undefined}
              disabled={!step2Active || isFeedbackDone}
            >
              {isFeedbackDone ? "Completed" : "Give Feedback"}
            </button>
          </div>

          <div className={`mf-step ${step3Active ? "active" : "locked"}`}>
            <div className="mf-step-head">
              <div className={`mf-dot ${step3Active ? "active" : ""}`} />
              <div className="mf-step-texts">
                <div className="mf-step-title">Step 3</div>
                <div className="mf-step-desc">Reveal your reward</div>
              </div>
              <div className="mf-status">{step3Active ? "Ready" : "Locked"}</div>
            </div>

            <button
              className={`mf-btn ${step3Active ? "mf-btn-gradient" : "mf-btn-locked"}`}
              onClick={step3Active ? handleScratch : undefined}
              disabled={!step3Active}
            >
              Scratch and Win
            </button>
          </div>
        </div>

        <div className="mf-footer">
          <div className="mf-footer-line" />
          <p className="mf-footer-text">Powered by Jockey Rewards</p>
        </div>
      </div>
    </div>
  );
}
