import React, { useEffect, useState } from "react";
import ScratchCanvas from "./ScratchCanvas";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../PopupProvider";
import "./ScratchCardPage.css";

export default function ScratchCardPage() {
  const [prize, setPrize] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showPrizePopup, setShowPrizePopup] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { triggerPopup } = usePopup();
  const navigate = useNavigate();

  useEffect(() => {
    const pool = [...Array(30).fill(10)];
    setPrize(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

  const onComplete = () => {
    setRevealed(true);
    setShowPrizePopup(true);
    setTimeout(() => setShowPrizePopup(false), 2600);
  };

  const handleClaim = async () => {
    setClaiming(true);
    await new Promise((r) => setTimeout(r, 900));
    await triggerPopup();
    localStorage.removeItem("jockey_user");
    localStorage.removeItem("jockey_feedback_done");
    localStorage.setItem("jockey_reset", "1");
    navigate("/");
    setClaiming(false);
  };

  return (
    <div className="sc-wrap">
      <div className="sc-glow sc-glow-a" />
      <div className="sc-glow sc-glow-b" />

      <div className="sc-shell">
        <div className="sc-header">
          <img src="/images/image.jpeg" alt="Logo" className="sc-logo" />
          <div className="sc-title-wrap">
            <h1 className="sc-title">SLG JOCKEY</h1>
            <p className="sc-subtitle">Scratch to reveal your reward</p>
          </div>
        </div>

        <div className={`sc-card ${revealed ? "done" : ""}`}>
          <div className="sc-card-frame" />
          <div className="sc-card-inner">
            <ScratchCanvas
              width={320}
              height={320}
              coverImage="/images/qr4.jpg"
              brushSize={26}
              finishPercent={40}
              onComplete={onComplete}
            >
              <div className="sc-reveal-layer">
                <div className="sc-reward">
                  <div className="sc-reward-badge">Congratulations</div>
                  <div className="sc-reward-value">{prize}% OFF</div>
                  <div className="sc-reward-text">On your next purchase</div>
                </div>
              </div>
            </ScratchCanvas>

            {!revealed ? (
              <div className="sc-hint">
                <div className="sc-hint-title">Scratch here</div>
                <div className="sc-hint-text">Reveal your discount reward</div>
              </div>
            ) : null}
          </div>
        </div>

        {showPrizePopup ? (
          <div className="sc-toast">
            🎉 You won {prize}% off on your next purchase
          </div>
        ) : null}

        {revealed ? (
          <div className="sc-actions">
            <button
              className={`sc-cta ${claiming ? "loading" : ""}`}
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? "Submitting..." : "Claim Reward"}
            </button>
            <p className="sc-note">Your reward will be confirmed and saved automatically.</p>
          </div>
        ) : (
          <div className="sc-footer">
            <p className="sc-footer-text">Powered by Jockey Rewards</p>
          </div>
        )}
      </div>
    </div>
  );
}
