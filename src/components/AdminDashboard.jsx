import React, { useState } from 'react';
import { GAMES, PRACTICE_DAYS, VENUE_INFO } from '../data/initialData';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Trash2, Search, Plus, DollarSign, Users, Award, Edit3, UserCheck, Flame } from 'lucide-react';

export default function AdminDashboard({ players, onUpdatePlayers, adminMode, onToggleAdmin }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('players'); // 'players', 'practice', 'spots'
  const [filterGame, setFilterGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Invalid Admin Password!');
        return;
      }

      onToggleAdmin(true);
      setAuthError('');
    } catch (err) {
      console.error('[AdminDashboard] login error:', err);
      setAuthError('Connection error reaching authentication server.');
    }
  };

  // Toggle Player Payment Status
  const handleToggleStatus = async (playerId) => {
    try {
      const res = await fetch(`/api/players/${playerId}/status`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updatedPlayer = await res.json();
        const updated = players.map(p => p.id === playerId ? updatedPlayer : p);
        onUpdatePlayers(updated);
      }
    } catch (err) {
      console.error('[AdminDashboard] status update error:', err);
    }
  };

  // Delete Player
  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to remove this player registration?')) {
      try {
        const res = await fetch(`/api/players/${playerId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const updated = players.filter(p => p.id !== playerId);
          onUpdatePlayers(updated);
        }
      } catch (err) {
        console.error('[AdminDashboard] delete player error:', err);
      }
    }
  };

  if (!adminMode) {
    return (
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(230, 0, 57, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Lock size={32} color="var(--accent-red)" />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>ORGANIZER ADMIN LOGIN</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Access registration verification, EcoCash management, practice attendance, and bracket control.
            </p>

            {authError && (
              <div style={{
                padding: '10px',
                background: 'rgba(230, 0, 57, 0.2)',
                color: '#ff4d4d',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <input 
                type="password"
                placeholder="Enter Admin Password (admin2026)"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '1rem',
                  marginBottom: '16px',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                <ShieldCheck size={18} /> UNLOCK ADMIN PANEL
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // Filtered players list
  const filteredPlayers = players.filter(p => {
    const matchesGame = filterGame === 'all' || p.gameId === filterGame;
    const matchesQuery = !searchQuery || 
      p.gamerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ecoRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGame && matchesQuery;
  });

  // Calculate overall stats
  const totalVerified = players.filter(p => p.status === 'Verified').length;
  const totalRevenue = players.reduce((sum, p) => p.status === 'Verified' ? sum + p.totalFee : sum, 0);

  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={28} color="var(--accent-red)" />
              <h2 style={{ fontSize: '2.4rem', lineHeight: 1 }}>ORGANIZER CONTROL PANEL</h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              2909 Nketa 7 FGC Competition Operations
            </div>
          </div>

          <button className="btn btn-outline-danger" onClick={() => onToggleAdmin(false)}>
            <Lock size={16} /> LOCK ADMIN SESSION
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Players</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: '#fff', lineHeight: 1 }}>
              {players.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 45 Max</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', marginTop: '4px' }}>
              {totalVerified} EcoCash Verified
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Collected Revenue (EcoCash)</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--accent-green)', lineHeight: 1 }}>
              ${totalRevenue}.00 USD
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Entry Fees ($5) + Practice Passes ($1)
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cash Prizes Reserved</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--accent-gold)', lineHeight: 1 }}>
              $75.00 USD
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              $25 Pool x 3 Games (1st, 2nd, 3rd)
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button 
            className={`btn btn-secondary ${activeAdminTab === 'players' ? 'btn-active' : ''}`}
            onClick={() => setActiveAdminTab('players')}
            style={{ borderColor: activeAdminTab === 'players' ? 'var(--accent-orange)' : 'transparent' }}
          >
            <Users size={16} /> Player Registrations ({players.length})
          </button>
          <button 
            className={`btn btn-secondary ${activeAdminTab === 'practice' ? 'btn-active' : ''}`}
            onClick={() => setActiveAdminTab('practice')}
            style={{ borderColor: activeAdminTab === 'practice' ? 'var(--accent-cyan)' : 'transparent' }}
          >
            <UserCheck size={16} /> Practice Check-ins ($1/day)
          </button>
        </div>

        {/* TAB 1: PLAYER REGISTRATIONS TABLE */}
        {activeAdminTab === 'players' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            
            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input 
                    type="text"
                    placeholder="Search by Gamer Tag, Name, EcoRef, Ticket ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={filterGame}
                  onChange={e => setFilterGame(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Games</option>
                  <option value="dbz">Dragon Ball FighterZ</option>
                  <option value="guilty-gear">Guilty Gear Strive</option>
                  <option value="tekken7">Tekken 7</option>
                </select>
              </div>
            </div>

            {/* Players Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>TICKET ID</th>
                    <th style={{ padding: '12px' }}>GAMER TAG / NAME</th>
                    <th style={{ padding: '12px' }}>GAME</th>
                    <th style={{ padding: '12px' }}>PRACTICE DAYS</th>
                    <th style={{ padding: '12px' }}>ECOCASH REF</th>
                    <th style={{ padding: '12px' }}>FEE PAID</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => {
                    const gameObj = GAMES.find(g => g.id === player.gameId);
                    return (
                      <tr key={player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-orange)' }}>
                          {player.id}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{player.gamerTag}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.fullName} ({player.phone})</div>
                        </td>
                        <td style={{ padding: '12px', color: gameObj?.color, fontWeight: 600 }}>
                          {gameObj?.name}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {player.practiceDates && player.practiceDates.length > 0 ? (
                            <span className="badge badge-cyan">
                              {player.practiceDates.length} Days
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {player.ecoRef}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-green)' }}>
                          ${player.totalFee}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span 
                            className={`badge ${player.status === 'Verified' ? 'badge-green' : 'badge-orange'}`}
                            onClick={() => handleToggleStatus(player.id)}
                            style={{ cursor: 'pointer' }}
                            title="Click to toggle payment verification"
                          >
                            {player.status === 'Verified' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {player.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeletePlayer(player.id)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '4px' }}
                            title="Delete Player Registration"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: PRACTICE SESSION CHECK-IN SCANNER */}
        {activeAdminTab === 'practice' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '16px' }}>
              DAILY WARM-UP PRACTICE CHECK-IN LIST ($1/DAY)
            </h3>
            
            <div className="grid-2">
              {PRACTICE_DAYS.map(day => {
                const attending = players.filter(p => p.practiceDates && p.practiceDates.includes(day.id));
                return (
                  <div key={day.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>{day.label}</strong>
                      <span className="badge badge-cyan">{attending.length} Registered</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {day.time} @ 2909 Nketa 7
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {attending.map(player => (
                        <div key={player.id} style={{
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.85rem'
                        }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{player.gamerTag} ({player.fullName})</span>
                          <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }}>PASS VERIFIED</span>
                        </div>
                      ))}
                      {attending.length === 0 && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          No practice bookings for this date yet.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
