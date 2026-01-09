import React, { useEffect, useState } from 'react';
import ScratchCanvas from './ScratchCanvas';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../PopupProvider';
import './ScratchCardPage.css';

export default function ScratchCardPage() {
  const [prize, setPrize] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showPrizePopup, setShowPrizePopup] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { triggerPopup } = usePopup();
  const navigate = useNavigate();

  useEffect(() => {
    const pool = [
  
      ...Array(30).fill(10),
      
    ];
    setPrize(pool[Math.floor(Math.random() * pool.length)]);
  }, []);

  const onComplete = () => {
    setRevealed(true);
    setShowPrizePopup(true);
  };

  const handleClaim = async () => {
    setClaiming(true);
    setShowPrizePopup(false);
    await new Promise(r => setTimeout(r, 900));
    await triggerPopup();
    navigate('/');
    setClaiming(false);
  };

  return (
    <div className="scratch-page-container">
      <img src="/images/bg2.jpg" alt="background" className="bg-image" />
      <div className="overlay-sunburst" />
      <div className="ticket-edges te-top" />
      <div className="ticket-edges te-bottom" />

      <div className="confetti-field">
        {Array.from({ length: 90 }).map((_, i) => (
          <span key={i} className="confetti" style={{ '--i': i + 1 }} />
        ))}
      </div>

      <div className="balloons">
        <i className="balloon b1" />
        <i className="balloon b2" />
        <i className="balloon b3" />
        <i className="balloon b4" />
      </div>

      <div className="coins">
        {Array.from({ length: 10 }).map((_, i) => (
          <i key={i} className="coin" style={{ '--c': i + 1 }} />
        ))}
      </div>

      <div className="sparkle-grid">
        {Array.from({ length: 48 }).map((_, i) => (
          <b key={i} style={{ '--s': i + 1 }} />
        ))}
      </div>

      <div className="ribbons">
        {Array.from({ length: 16 }).map((_, i) => (
          <em key={i} style={{ '--r': i + 1 }} />
        ))}
      </div>

      <div className="content-wrapper">
        <div className="header-section">
          <img src="/images/sample-logo.jpg" alt="Logo" className="logo" />
          <h1 className="heading">
            <span className="heading-text">Manhar Shopping Mall</span>
            <span className="heading-underline" />
          </h1>
        </div>

        <div className={`scratch-card-wrap ${revealed ? 'done' : ''}`}>
          <div className="wrap-glow" />
          <div className="wrap-foil" />
          <ScratchCanvas
            width={320}
            height={320}
            coverImage="/images/qr6.jpg"
            brushSize={26}
            finishPercent={40}
            onComplete={onComplete}
          >
            <div className="scratch-content-layer">
              {revealed && (
                <>
                  <div className="fireworks">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`fw f${i + 1}`}>
                        {Array.from({ length: 12 }).map((_, j) => (
                          <span key={j} style={{ '--j': j }} />
                        ))}
                      </div>
                    ))}
                  </div>
                  {showPrizePopup && (
                    <div className="reveal-amount">
                      <h2>🎉 You won {prize}% off on your next purchase</h2>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScratchCanvas>
          {!revealed && <div className="shine" />}
        </div>

        {revealed && (
          <div className="after-reveal">
            <button className={`cta ${claiming ? 'loading' : ''}`} onClick={handleClaim} disabled={claiming}>
              {claiming ? 'Submitting...' : 'Claim Reward'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
