import React from 'react';
import { PRACTICE_DAYS, VENUE_INFO } from '../data/initialData';
import { CalendarCheck, ShieldAlert, CheckCircle, Clock, MapPin, DollarSign, UserCheck, Flame } from 'lucide-react';

export default function PracticeSessionPortal({ players, onOpenRegister, onOpenMyPass }) {
  
  // Collect all practice bookings across verified players
  const practiceCounts = {};
  PRACTICE_DAYS.forEach(day => {
    practiceCounts[day.id] = players.filter(p => p.practiceDates && p.practiceDates.includes(day.id)).length;
  });

  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>
            PRE-TOURNAMENT WARM-UP SESSIONS | $1 PER DAY
          </div>
          <h2 style={{ fontSize: '2.8rem', lineHeight: 1 }}>
            EXCLUSIVE PRACTICE DAYS
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
            Practice sessions are held daily at <strong style={{ color: '#fff' }}>2909 Nketa 7</strong> before the main competition starts on August 5th.
          </p>
        </div>

        {/* Exclusive Rule Notice Banner */}
        <div className="glass-panel" style={{
          padding: '20px 24px',
          borderRadius: 'var(--radius-md)',
          borderColor: 'rgba(0, 210, 255, 0.4)',
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(18, 20, 32, 0.95) 100%)',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 210, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={28} color="var(--accent-cyan)" />
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
              STRICT PARTICIPANT-ONLY ACCESS
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
              Practice sessions ($1/day) are <strong style={{ color: 'var(--accent-cyan)' }}>exclusively offered to players who have registered, secured their 15-player spot, and completed their $5 EcoCash payment</strong>. Non-participants cannot book practice slots.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={onOpenRegister}>
              <Flame size={16} /> REGISTER & ADD PRACTICE
            </button>
            <button className="btn btn-secondary" onClick={onOpenMyPass}>
              VIEW MY PASS
            </button>
          </div>
        </div>

        {/* Practice Timetable Cards */}
        <div className="grid-2" style={{ marginBottom: '40px' }}>
          {PRACTICE_DAYS.map((day) => {
            const count = practiceCounts[day.id] || 0;
            return (
              <div 
                key={day.id} 
                className="glass-panel" 
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>PRACTICE</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>$1</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '2px' }}>
                      {day.label}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--accent-cyan)" /> {day.time}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="badge badge-cyan" style={{ marginBottom: '4px' }}>
                    <UserCheck size={12} /> {count} Attending
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    2909 Nketa 7 Setup
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Station Guidelines */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="var(--accent-orange)" /> PRACTICE SESSION GUIDELINES & SETUPS
          </h3>
          <div className="grid-3" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. Check-in Requirements</strong>
              Show your digital player ticket ID or EcoCash reference at the 2909 Nketa 7 door upon arrival.
            </div>
            <div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. Bring Your Controller</strong>
              PS4 / PC dualshock or fightsticks welcomed. Setup monitors and consoles provided on site.
            </div>
            <div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. Free Casual Sparring</strong>
              Connect with fellow 15-player cap contenders for matchup practice and warm-up sets.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
