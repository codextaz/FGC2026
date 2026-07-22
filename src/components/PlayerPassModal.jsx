import React, { useState } from 'react';
import { GAMES, VENUE_INFO } from '../data/initialData';
import { X, Ticket, QrCode, Printer, CheckCircle, Search, Calendar, MapPin, ShieldCheck, Flame, Lock, AlertCircle, LogOut } from 'lucide-react';

export default function PlayerPassModal({ isOpen, onClose, playerPass, players, onUnlockPass, onClearPass }) {
  if (!isOpen) return null;

  // Private login form state
  const [identifierInput, setIdentifierInput] = useState('');
  const [ecoRefInput, setEcoRefInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Handle Private Authentication
  const handleAuthenticatePass = (e) => {
    e.preventDefault();

    const cleanIdentifier = identifierInput.trim().toLowerCase();
    const cleanRef = ecoRefInput.trim().toUpperCase().replace(/\s+/g, '');

    if (!cleanIdentifier || !cleanRef) {
      setAuthError('Please fill in both your Gamer Tag / Phone / Ticket ID and your EcoCash Reference Code.');
      return;
    }

    // Look for matching player with BOTH identifier AND matching EcoCash Ref
    const matchedPlayer = players.find(p => {
      const matchId = p.id.toLowerCase() === cleanIdentifier;
      const matchTag = p.gamerTag.toLowerCase() === cleanIdentifier;
      const matchPhone = p.phone.replace(/\D/g, '') === cleanIdentifier.replace(/\D/g, '');

      const matchRef = p.ecoRef.trim().toUpperCase().replace(/\s+/g, '') === cleanRef;

      return (matchId || matchTag || matchPhone) && matchRef;
    });

    if (matchedPlayer) {
      setAuthError('');
      onUnlockPass(matchedPlayer);
      setIdentifierInput('');
      setEcoRefInput('');
    } else {
      setAuthError('Authentication failed. The EcoCash reference code does not match this player account.');
    }
  };

  const activePass = playerPass;
  const selectedGameObj = activePass ? GAMES.find(g => g.id === activePass.gameId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 210, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.6rem', lineHeight: 1 }}>
              {activePass ? 'MY PRIVATE DIGITAL PASS' : 'PRIVATE PASS AUTHENTICATION'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          {/* CASE 1: Pass is Unlocked / Authenticated */}
          {activePass ? (
            <div>
              {/* Security Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--accent-cyan)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={14} /> Private player pass unlocked for <strong>{activePass.gamerTag}</strong>
                </div>
                <button
                  onClick={onClearPass}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Lock pass on this device"
                >
                  <LogOut size={14} /> Lock Pass
                </button>
              </div>

              {/* Printable Ticket Badge */}
              <div 
                id="printable-ticket"
                style={{
                  background: 'linear-gradient(135deg, #121420 0%, #1a1d2e 100%)',
                  border: `2px solid ${selectedGameObj?.color || 'var(--accent-orange)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 0 30px ${selectedGameObj?.color || 'var(--accent-orange)'}33`
                }}
              >
                {/* Background Watermark */}
                <div style={{
                  position: 'absolute',
                  right: '-30px',
                  bottom: '-30px',
                  opacity: 0.05,
                  fontSize: '12rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  pointerEvents: 'none'
                }}>
                  EVO
                </div>

                {/* Top Pass Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Flame size={20} color="var(--accent-orange)" />
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#fff', letterSpacing: '1px' }}>
                        EVO NKETA 7 CHAMPIONSHIP
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--accent-orange)" /> 2909 Nketa 7, Bulawayo
                    </div>
                  </div>

                  <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    <ShieldCheck size={14} /> ECO-VERIFIED PASS
                  </span>
                </div>

                {/* Player Details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '20px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '18px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Participant Gamer Tag
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.4rem',
                      lineHeight: 1,
                      color: selectedGameObj?.color || 'var(--accent-orange)',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      {activePass.gamerTag}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{activePass.fullName}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                        <span style={{ color: '#fff' }}>{activePass.phone}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Game: </span>
                        <span style={{ color: selectedGameObj?.color, fontWeight: 700 }}>{selectedGameObj?.name}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                        <span style={{ color: '#fff' }}>{selectedGameObj?.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center'
                  }}>
                    <svg width="80" height="80" viewBox="0 0 100 100" style={{ marginBottom: '6px' }}>
                      <rect width="100" height="100" fill="#ffffff"/>
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" fill="#000"/>
                      <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" fill="#000"/>
                      <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" fill="#000"/>
                      <rect x="40" y="10" width="20" height="10" fill="#000"/>
                      <rect x="40" y="30" width="10" height="20" fill="#000"/>
                      <rect x="60" y="40" width="30" height="10" fill="#000"/>
                      <rect x="40" y="70" width="20" height="20" fill="#000"/>
                      <rect x="70" y="70" width="20" height="10" fill="#000"/>
                    </svg>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#000', letterSpacing: '1px' }}>
                      {activePass.id}
                    </div>
                  </div>
                </div>

                {/* Practice Sessions */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Booked Practice Sessions ($1/day):
                  </div>
                  {activePass.practiceDates && activePass.practiceDates.length > 0 ? (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {activePass.practiceDates.map(dateStr => (
                        <span key={dateStr} className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
                          <Calendar size={12} /> {dateStr}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      No practice days added (Main Tournament Only)
                    </span>
                  )}
                </div>

                {/* Payment Reference */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px dashed rgba(255,255,255,0.1)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <div>
                    EcoCash Ref: <span style={{ color: '#fff', fontFamily: 'monospace' }}>{activePass.ecoRef}</span>
                  </div>
                  <div>
                    Total Paid: <strong style={{ color: 'var(--accent-green)' }}>${activePass.totalFee}.00 USD</strong>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
                  <Printer size={18} /> PRINT / SAVE TICKET
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
                  CLOSE PASS
                </button>
              </div>
            </div>
          ) : (
            
            /* CASE 2: Private Pass Authentication Form */
            <form onSubmit={handleAuthenticatePass} style={{ padding: '10px 0' }}>
              
              <div style={{
                background: 'rgba(255, 94, 0, 0.05)',
                border: '1px solid rgba(255, 94, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 94, 0, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Lock size={24} color="var(--accent-orange)" />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '6px' }}>
                  PROTECTED PLAYER TICKET ACCESS
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, maxWidth: '480px', margin: '0 auto' }}>
                  Player passes contain event credentials and are private. Enter your gamer details along with your payment reference to unlock your digital badge.
                </p>
              </div>

              {authError && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(230, 0, 57, 0.15)',
                  border: '1px solid var(--accent-red)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ff4d4d',
                  fontSize: '0.88rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={18} /> {authError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Gamer Tag / Ticket ID / Phone Number *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. ShadowStriker or 0771234567 or EVO-2026-001"
                  value={identifierInput}
                  onChange={e => setIdentifierInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Your EcoCash Reference Code (Secret Verification PIN) *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. MP260722.1402.A12345"
                  value={ecoRefInput}
                  onChange={e => setEcoRefInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1.5px solid var(--accent-orange)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  This is the transaction code received in your EcoCash SMS upon registration.
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                <ShieldCheck size={18} /> VERIFY & UNLOCK MY TICKET PASS
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
