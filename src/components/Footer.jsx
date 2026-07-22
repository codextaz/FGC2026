import React from 'react';
import { Flame, MapPin, Phone, ShieldCheck, Heart, Trophy, Calendar } from 'lucide-react';
import { VENUE_INFO } from '../data/initialData';

export default function Footer({ onSelectTab, onOpenRegister }) {
  return (
    <footer style={{
      background: '#06070a',
      borderTop: '1px solid var(--border-color)',
      padding: '50px 0 30px 0',
      color: 'var(--text-muted)',
      marginTop: '60px'
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #ff5e00 0%, #e60039 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={20} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', letterSpacing: '1px' }}>
                EVO NKETA 7 FGC
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Bulawayo's local fighting game championship. 15 spots per game limit, $5 entry fee, exclusive $1/day practice sessions, and $25 cash prizes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent-orange)' }}>
              <MapPin size={16} /> 2909 Nketa 7, Bulawayo
            </div>
          </div>

          {/* Quick Schedule */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '14px' }}>
              TOURNAMENT DATES
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                <span>Dragon Ball FighterZ</span>
                <strong style={{ color: 'var(--accent-orange)' }}>Aug 5, 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                <span>Guilty Gear Strive</span>
                <strong style={{ color: 'var(--accent-red)' }}>Aug 6, 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                <span>Tekken 7</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>Aug 7, 2026</strong>
              </div>
            </div>
          </div>

          {/* EcoCash Support & Prizes */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '14px' }}>
              PAYMENT & PRIZES
            </h4>
            <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '8px' }}>
                EcoCash Transfer: <strong style={{ color: '#fff' }}>{VENUE_INFO.ecoCashNumber}</strong>
              </div>
              <div style={{ marginBottom: '8px' }}>
                Prize purse: <strong style={{ color: 'var(--accent-gold)' }}>$25 Cash Prize per game</strong> (1st $15, 2nd $7, 3rd $3).
              </div>
              <div className="badge badge-green" style={{ marginTop: '6px' }}>
                <ShieldCheck size={12} /> ECOCASH VERIFIED TOURNAMENT
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          &copy; 2026 EVO Nketa 7 FGC Local Championship. Hosted at 2909 Nketa 7. Built for the community.
        </div>

      </div>
    </footer>
  );
}
