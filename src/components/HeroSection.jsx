import React, { useState, useEffect } from 'react';
import { Flame, MapPin, Calendar, Trophy, Zap, AlertTriangle, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';
import { VENUE_INFO } from '../data/initialData';

export default function HeroSection({ onOpenRegister, onSelectTab }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-08-05T10:00:00+02:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      padding: '60px 0 40px 0',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Glow Effects */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(ellipse at center, rgba(255, 94, 0, 0.25) 0%, rgba(230, 0, 57, 0.15) 50%, transparent 80%)',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Top Banner Badges */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 16px',
            background: 'rgba(255, 94, 0, 0.12)',
            border: '1px solid rgba(255, 94, 0, 0.4)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(255, 94, 0, 0.2)'
          }}>
            <Flame size={18} color="var(--accent-orange)" />
            <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>
              EXCLUSIVE LOCAL EVO TOURNAMENT
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>STRICT 15 PLAYERS PER GAME</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            lineHeight: 0.95,
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(180deg, #ffffff 30%, #a0a5ba 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))'
          }}>
            FIGHT FOR GLORY AT <br />
            <span style={{
              background: 'linear-gradient(90deg, #ff5e00 0%, #ff9900 50%, #e60039 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              2909 NKETA 7
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            maxWidth: '680px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}>
            Bulawayo's ultimate local FGC clash featuring <strong style={{ color: '#fff' }}>Dragon Ball FighterZ</strong>, <strong style={{ color: '#fff' }}>Guilty Gear Strive</strong> & <strong style={{ color: '#fff' }}>Tekken 7</strong>. Each game has its own dedicated day!
          </p>

          {/* Countdown Clock */}
          <div style={{
            display: 'inline-flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '36px',
            flexWrap: 'wrap'
          }}>
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="glass-panel" style={{
                padding: '12px 20px',
                minWidth: '90px',
                textAlign: 'center',
                borderColor: 'rgba(255, 94, 0, 0.3)',
                background: 'rgba(18, 20, 32, 0.95)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: 'var(--accent-orange)',
                  fontWeight: 700
                }}>
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Key Quick Info Grid */}
          <div className="grid-3" style={{ marginBottom: '36px', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-orange)', marginBottom: '6px' }}>
                <MapPin size={20} />
                <h3 style={{ fontSize: '1.2rem' }}>VENUE LOCATION</h3>
              </div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>2909 Nketa 7, Bulawayo</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Exclusive local gaming station setups</div>
            </div>

            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-gold)', marginBottom: '6px' }}>
                <Trophy size={20} />
                <h3 style={{ fontSize: '1.2rem' }}>$25 CASH PRIZES</h3>
              </div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>1st, 2nd & 3rd Place Cash Payouts</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>1st: $15 | 2nd: $7 | 3rd: $3 per game</div>
            </div>

            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                <Zap size={20} />
                <h3 style={{ fontSize: '1.2rem' }}>PRACTICE PASS ($1/DAY)</h3>
              </div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Warm-up Practice Sessions</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Exclusive to signed-up & paid players</div>
            </div>
          </div>

          {/* Action Callouts */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary pulse-glow" style={{ padding: '16px 36px', fontSize: '1.25rem' }} onClick={onOpenRegister}>
              <Flame size={22} /> REGISTER NOW — $5 ENTRY
            </button>
            <button className="btn btn-secondary" style={{ padding: '16px 28px', fontSize: '1.1rem' }} onClick={() => onSelectTab('practice')}>
              <Calendar size={20} color="var(--accent-cyan)" /> PRACTICE DAYS ($1/DAY)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
