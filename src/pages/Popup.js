import React from 'react';
import './Popup.css';

export default function Popup() {
  return (
    <div className="popup-overlay">
      <div className="popup-ambient">
        {Array.from({ length: 40 }).map((_, i) => (
          <i key={i} style={{ '--i': i + 1 }} />
        ))}
      </div>

      <div className="popup-card">
        <div className="popup-glow" />
        <div className="popup-badge">
          <span className="popup-logo">J</span>
        </div>
        <h2 className="popup-title">Jockey Scratch & Win</h2>
        <p className="popup-text">
          Scratch and win exclusive rewards on your purchase. Guaranteed prizes up to 15% off.
        </p>
        <p className="popup-subtext">Your reward is waiting. Start now.</p>
        <div className="popup-shine" />
      </div>
    </div>
  );
}
