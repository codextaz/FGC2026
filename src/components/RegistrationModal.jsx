import React, { useState } from 'react';
import { GAMES, PRACTICE_DAYS, VENUE_INFO } from '../data/initialData';
import { validateEcoRef, checkDuplicateGamerTag, checkDuplicatePhone } from '../utils/referralValidation';
import { X, Check, DollarSign, Calendar, Flame, Smartphone, Info, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, selectedGameId, players, onCompleteRegistration }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Info & Practice, 2: EcoCash Payment
  const [gamerTag, setGamerTag] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gameId, setGameId] = useState(selectedGameId || 'dbz');
  const [selectedPracticeDates, setSelectedPracticeDates] = useState([]);
  const [ecoRef, setEcoRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check spot limit
  const currentCount = players.filter(p => p.gameId === gameId).length;
  const isFull = currentCount >= 15;

  const handleTogglePracticeDate = (dateId) => {
    if (selectedPracticeDates.includes(dateId)) {
      setSelectedPracticeDates(selectedPracticeDates.filter(d => d !== dateId));
    } else {
      setSelectedPracticeDates([...selectedPracticeDates, dateId]);
    }
  };

  const totalFee = VENUE_INFO.entryFee + (selectedPracticeDates.length * VENUE_INFO.practiceFeePerDay);

  const handleGoToPayment = (e) => {
    e.preventDefault();

    if (!gamerTag.trim() || !fullName.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields (Gamer Tag, Full Name, Phone).');
      return;
    }

    if (isFull) {
      setErrorMsg('Selected game is currently sold out! Please pick another game.');
      return;
    }

    // Prevent duplicate gamer tags
    const tagCheck = checkDuplicateGamerTag(gamerTag, players);
    if (tagCheck.isDuplicate) {
      setErrorMsg(tagCheck.error);
      return;
    }

    // Prevent the same phone number being used to register twice
    const phoneCheck = checkDuplicatePhone(phone, players);
    if (phoneCheck.isDuplicate) {
      setErrorMsg(phoneCheck.error);
      return;
    }

    setErrorMsg('');
    setStep(2);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    // Client-side pre-check before hitting the network
    const existingRefs = players.map((player) => player.ecoRef);
    const validation = validateEcoRef(ecoRef, existingRefs);
    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gamerTag: gamerTag.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          gameId,
          practiceDates: selectedPracticeDates,
          totalFee,
          ecoRef,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Success — pass the server-created player up to App
      onCompleteRegistration(data);
      setStep(1);
      setErrorMsg('');
      setEcoRef('');
      setGamerTag('');
      setFullName('');
      setPhone('');
      setSelectedPracticeDates([]);
    } catch (err) {
      console.error('[RegistrationModal] POST error:', err);
      setErrorMsg('Network error: Could not reach the server. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedGameObj = GAMES.find(g => g.id === gameId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 94, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={24} color="var(--accent-orange)" />
            <div>
              <h2 style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                {step === 1 ? 'TOURNAMENT SIGN UP' : 'ECOCASH PAYMENT CONFIRMATION'}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Step {step} of 2 • 2909 Nketa 7 EVO FGC
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            padding: '12px 24px',
            background: 'rgba(230, 0, 57, 0.15)',
            borderBottom: '1px solid var(--accent-red)',
            color: '#ff4d4d',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* Step 1: Info & Practice */}
        {step === 1 && (
          <form onSubmit={handleGoToPayment} style={{ padding: '24px' }}>
            
            {/* Game Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Tournament Game *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                {GAMES.map((g) => {
                  const filled = players.filter(p => p.gameId === g.id).length;
                  const full = filled >= g.maxSpots;
                  const selected = gameId === g.id;

                  return (
                    <div
                      key={g.id}
                      onClick={() => !full && setGameId(g.id)}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: selected ? 'rgba(255, 94, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${selected ? 'var(--accent-orange)' : 'var(--border-color)'}`,
                        cursor: full ? 'not-allowed' : 'pointer',
                        opacity: full ? 0.5 : 1,
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: selected ? '#fff' : 'var(--text-main)', fontSize: '0.95rem' }}>
                        {g.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: selected ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                        {g.date.split(',')[0]} • {g.maxSpots - filled} spots left
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Gamer Tag / Handle *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. ShadowStriker"
                  value={gamerTag}
                  onChange={e => setGamerTag(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Full Legal Name *
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Kelvin Ndlovu"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                WhatsApp / Phone Number *
              </label>
              <input 
                type="text"
                placeholder="e.g. 0774 123 456"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Practice Session Add-on ($1/day) */}
            <div style={{
              background: 'rgba(0, 210, 255, 0.05)',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    PRE-EVENT PRACTICE PASS ($1 / DAY)
                  </span>
                </div>
                <span className="badge badge-cyan">EXCLUSIVE TO REGISTERED PLAYERS</span>
              </div>
              
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Book warm-up sessions before August 5th at 2909 Nketa 7 setup stations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {PRACTICE_DAYS.map((day) => {
                  const isChecked = selectedPracticeDates.includes(day.id);
                  return (
                    <div
                      key={day.id}
                      onClick={() => handleTogglePracticeDate(day.id)}
                      style={{
                        padding: '8px 10px',
                        background: isChecked ? 'rgba(0, 210, 255, 0.2)' : 'rgba(0,0,0,0.4)',
                        border: `1px solid ${isChecked ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: isChecked ? '#fff' : 'var(--text-muted)',
                        transition: 'var(--transition)'
                      }}
                    >
                      <span>{day.label}</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>+$1</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Fee Summary */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculation breakdown:</div>
                <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                  $5 Entry ({selectedGameObj?.name}) {selectedPracticeDates.length > 0 && `+ $${selectedPracticeDates.length} Practice (${selectedPracticeDates.length} days)`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL DUE</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--accent-green)', lineHeight: 1 }}>
                  ${totalFee}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
              PROCEED TO ECOCASH PAYMENT (${totalFee})
            </button>
          </form>
        )}

        {/* Step 2: EcoCash Instructions & Ref Input */}
        {step === 2 && (
          <form onSubmit={handleSubmitRegistration} style={{ padding: '24px' }}>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 176, 255, 0.15) 0%, rgba(0, 129, 203, 0.15) 100%)',
              border: '1px solid rgba(0, 176, 255, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <Smartphone size={28} color="#00b0ff" />
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', lineHeight: 1, color: '#fff' }}>
                    ECOCASH TRANSFER INSTRUCTIONS
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Payment Recommended via EcoCash Send Money / Merchant
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recipient EcoCash Number:</span>
                  <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{VENUE_INFO.ecoCashNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
                  <strong style={{ color: '#fff' }}>{VENUE_INFO.ecoCashName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Amount to Send:</span>
                  <strong style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}>${totalFee}.00 USD</strong>
                </div>
              </div>

              {/* Quick USSD Box */}
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#00b0ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>USSD Quick Dial: *151*2*2*{VENUE_INFO.ecoCashNumber.replace(/\s/g, '')}*{totalFee}#</span>
              </div>
            </div>

            {/* Input EcoCash Reference */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Enter EcoCash Transaction Approval Code / Reference ID *
              </label>
              <input 
                type="text"
                placeholder="e.g. MP260722.1530.A98765"
                value={ecoRef}
                onChange={e => setEcoRef(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1.5px solid var(--accent-orange)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  outline: 'none',
                  letterSpacing: '1px'
                }}
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                You can find this reference code in the confirmation SMS received from EcoCash.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-ecocash" 
                style={{ flex: 2, padding: '16px' }}
              >
                <ShieldCheck size={20} /> {submitting ? 'SUBMITTING...' : 'VERIFY & COMPLETE REGISTRATION'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
