import React from 'react';
import { GAMES } from '../data/initialData';
import { Users, Calendar, Trophy, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GameCards({ players, onRegisterGame, onSelectTab }) {

  // Calculate filled spots per game dynamically
  const getFilledCount = (gameId) => {
    return players.filter(p => p.gameId === gameId).length;
  };

  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-orange" style={{ marginBottom: '10px' }}>
            DEDICATED GAME DAYS | MAX 15 PLAYERS EACH
          </div>
          <h2 style={{ fontSize: '2.8rem', lineHeight: 1 }}>
            CHOOSE YOUR FIGHTING GAME
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Each game features its own exclusive competition day, $25 cash prize pool, and 15-player maximum tournament limit.
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className="grid-3">
          {GAMES.map((game) => {
            const count = getFilledCount(game.id);
            const remaining = game.maxSpots - count;
            const isFull = remaining <= 0;
            const progressPercent = Math.min(100, Math.round((count / game.maxSpots) * 100));

            return (
              <div 
                key={game.id} 
                className="glass-panel" 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'var(--transition)',
                  position: 'relative',
                  borderTop: `3px solid ${game.color}`
                }}
              >
                {/* Game Banner Header */}
                <div style={{
                  height: '180px',
                  backgroundImage: `linear-gradient(to bottom, rgba(10, 11, 16, 0.2), rgba(18, 20, 32, 0.95)), url(${game.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-orange" style={{ background: 'rgba(0,0,0,0.7)', borderColor: game.color, color: game.color }}>
                      {game.genre}
                    </span>
                    <span className={`badge ${isFull ? 'badge-red' : remaining <= 3 ? 'badge-orange' : 'badge-green'}`}>
                      {isFull ? 'SOLD OUT' : `${remaining} SPOTS LEFT`}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '2.2rem', lineHeight: 1, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                      {game.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                      {game.subtitle}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  <div>
                    {/* Day & Time info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '18px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <Calendar size={20} color={game.color} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{game.date}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{game.time} @ 2909 Nketa 7</div>
                      </div>
                    </div>

                    {/* Live Spot Progress Bar */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} /> Registered Players
                        </span>
                        <span style={{ fontWeight: 700, color: game.color }}>
                          {count} / {game.maxSpots} Caps
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          background: game.gradient,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Rules Quick Highlights */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Tournament Format:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {game.rules.map((rule, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={12} color="var(--accent-green)" /> {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-color)',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entry Fee</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', lineHeight: 1, color: '#fff' }}>
                          $5 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ player</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cash Prize Purse</div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', lineHeight: 1, color: 'var(--accent-gold)' }}>
                          $25 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(1st-3rd)</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className={`btn ${isFull ? 'btn-disabled' : 'btn-primary'}`}
                      style={{ width: '100%', background: isFull ? undefined : game.gradient }}
                      disabled={isFull}
                      onClick={() => onRegisterGame(game.id)}
                    >
                      {isFull ? 'SPOT LIMIT REACHED (15/15)' : `CLAIM SPOT FOR ${game.name}`} <ArrowRight size={18} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
