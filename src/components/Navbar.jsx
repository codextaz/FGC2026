import React from 'react';
import { Flame, Trophy, Calendar, CalendarCheck, ShieldCheck, Ticket, UserPlus } from 'lucide-react';

export default function Navbar({ onOpenRegister, onOpenMyPass, onSelectTab, activeTab, adminMode }) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255, 94, 0, 0.2)',
      borderRadius: 0,
      padding: '14px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff5e00 0%, #e60039 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(255, 94, 0, 0.5)'
          }}>
            <Flame size={26} color="#fff" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: '2px',
              background: 'linear-gradient(90deg, #fff 0%, #ff9900 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              EVO NKETA 7
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
              LOCAL FGC CHAMPIONSHIP 2026
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-secondary ${activeTab === 'home' ? 'btn-active' : ''}`}
            onClick={() => onSelectTab('home')}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              borderColor: activeTab === 'home' ? 'var(--accent-orange)' : 'transparent',
              color: activeTab === 'home' ? 'var(--accent-orange)' : 'var(--text-main)'
            }}
          >
            <Trophy size={16} /> Games & Slots
          </button>

          <button 
            className={`btn btn-secondary ${activeTab === 'practice' ? 'btn-active' : ''}`}
            onClick={() => onSelectTab('practice')}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              borderColor: activeTab === 'practice' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'practice' ? 'var(--accent-cyan)' : 'var(--text-main)'
            }}
          >
            <CalendarCheck size={16} /> Practice ($1/day)
          </button>

          <button 
            className={`btn btn-secondary ${activeTab === 'brackets' ? 'btn-active' : ''}`}
            onClick={() => onSelectTab('brackets')}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              borderColor: activeTab === 'brackets' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'brackets' ? 'var(--accent-gold)' : 'var(--text-main)'
            }}
          >
            <Calendar size={16} /> Brackets & Prizes
          </button>

          <button 
            className={`btn btn-secondary ${activeTab === 'pass' ? 'btn-active' : ''}`}
            onClick={onOpenMyPass}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <Ticket size={16} color="var(--accent-green)" /> My Player Pass
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => onSelectTab('admin')}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              color: adminMode ? 'var(--accent-red)' : 'var(--text-muted)',
              borderColor: adminMode ? 'var(--accent-red)' : 'transparent'
            }}
          >
            <ShieldCheck size={16} /> {adminMode ? 'Admin Active' : 'Organizer Portal'}
          </button>
        </div>

        {/* CTA Button */}
        <div>
          <button className="btn btn-primary pulse-glow" onClick={() => onOpenRegister()}>
            <UserPlus size={18} /> SIGN UP ($5)
          </button>
        </div>
      </div>
    </nav>
  );
}
