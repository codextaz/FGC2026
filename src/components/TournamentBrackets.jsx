import React, { useState } from 'react';
import { GAMES, VENUE_INFO } from '../data/initialData';
import { Trophy, Calendar, Award, Zap, ChevronRight, Swords, Star, Edit3, X, CheckCircle, ShieldCheck, Lock } from 'lucide-react';

export default function TournamentBrackets({ brackets, players = [], adminMode = false, onUpdateMatch }) {
  const [selectedGameTab, setSelectedGameTab] = useState('dbz');
  const [editingMatch, setEditingMatch] = useState(null); // match object currently being edited

  // Modal form local state
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winner, setWinner] = useState('');

  const activeGameObj = GAMES.find(g => g.id === selectedGameTab);
  const activeBracket = brackets[selectedGameTab] || [];

  // Registered players filtered for the active game
  const registeredGamePlayers = players.filter(p => p.gameId === selectedGameTab);

  // Group bracket matches by round
  const rounds = {
    'Quarter-Finals': activeBracket.filter(m => m.round === 'Quarter-Finals'),
    'Semi-Finals': activeBracket.filter(m => m.round === 'Semi-Finals'),
    'Grand Final': activeBracket.filter(m => m.round === 'Grand Final')
  };

  // Open edit modal for a match (Organizer only)
  const handleOpenEditMatch = (match) => {
    if (!adminMode) return;
    setEditingMatch(match);
    setPlayer1(match.player1 || 'TBD');
    setPlayer2(match.player2 || 'TBD');
    setScore1(match.score1 || 0);
    setScore2(match.score2 || 0);
    setWinner(match.winner || '');
  };

  // Save updated match
  const handleSaveMatch = (e) => {
    e.preventDefault();
    if (!editingMatch || !onUpdateMatch) return;

    let finalWinner = winner;
    // Auto-calculate winner if not manually chosen
    if (!finalWinner) {
      if (Number(score1) > Number(score2) && player1 !== 'TBD') finalWinner = player1;
      else if (Number(score2) > Number(score1) && player2 !== 'TBD') finalWinner = player2;
    }

    onUpdateMatch(selectedGameTab, editingMatch.matchId, {
      player1,
      player2,
      score1: Number(score1),
      score2: Number(score2),
      winner: finalWinner || null,
    });

    setEditingMatch(null);
  };

  return (
    <section style={{ padding: '60px 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge badge-orange" style={{ marginBottom: '10px' }}>
            OFFICIAL TOURNAMENT SCHEDULE & BRACKETS
          </div>
          <h2 style={{ fontSize: '2.8rem', lineHeight: 1 }}>
            COMPETITION & $25 CASH PRIZES
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Single & Double Elimination brackets for each 15-player lineup starting August 5, 2026.
          </p>
        </div>

        {/* Organizer Control Active Notice */}
        {adminMode ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(230, 0, 57, 0.15) 0%, rgba(255, 94, 0, 0.15) 100%)',
            border: '1px solid var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="var(--accent-red)" />
              <span>ORGANIZER BRACKET CONTROLLER: Click any match below to select registered players & record scores.</span>
            </div>
            <span className="badge badge-orange" style={{ fontSize: '0.75rem' }}>
              ORGANIZER EDITING ENABLED
            </span>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: '28px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <Lock size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Official Match Brackets (Read-Only Mode). Bracket changes can only be saved by the Tournament Organizer.
          </div>
        )}

        {/* Game Tab Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {GAMES.map(game => {
            const active = selectedGameTab === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGameTab(game.id)}
                className="btn btn-secondary"
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderColor: active ? game.color : 'transparent',
                  background: active ? 'rgba(18, 20, 32, 0.95)' : 'rgba(255,255,255,0.03)',
                  boxShadow: active ? `0 0 15px ${game.color}44` : 'none',
                  color: active ? '#fff' : 'var(--text-muted)'
                }}
              >
                <Swords size={18} color={game.color} />
                {game.name}
              </button>
            );
          })}
        </div>

        {/* Cash Prize Purse Breakdown Banner */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.1) 0%, rgba(18, 20, 32, 0.95) 100%)',
          borderColor: 'rgba(255, 183, 3, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', marginBottom: '4px' }}>
              <Trophy size={22} />
              <h3 style={{ fontSize: '1.4rem' }}>{activeGameObj?.name} CASH PURSE</h3>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Scheduled for <strong>{activeGameObj?.date}</strong> @ 2909 Nketa 7
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-around',
            background: 'rgba(0,0,0,0.3)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1ST PLACE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--accent-gold)', lineHeight: 1 }}>
                $15
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>+ Gold Trophy</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2ND PLACE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#c0c0c0', lineHeight: 1 }}>
                $7
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Silver Medal</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3RD PLACE</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#cd7f32', lineHeight: 1 }}>
                $3
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bronze Medal</div>
            </div>
          </div>
        </div>

        {/* Visual Bracket Grid */}
        <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))',
            gap: '24px',
            minWidth: '880px'
          }}>
            
            {/* Column 1: Quarter Finals */}
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                color: 'var(--accent-orange)',
                marginBottom: '16px',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                QUARTER-FINALS (TOP 8)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rounds['Quarter-Finals'].map(match => (
                  <div 
                    key={match.matchId} 
                    className="glass-panel" 
                    onClick={() => handleOpenEditMatch(match)}
                    style={{ 
                      padding: '14px', 
                      borderRadius: 'var(--radius-sm)',
                      cursor: adminMode ? 'pointer' : 'default',
                      border: adminMode ? '1px dashed var(--accent-orange)' : '1px solid var(--border-color)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>MATCH #{match.matchId} • BO3</span>
                      {adminMode && <span style={{ color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700 }}><Edit3 size={12} /> EDIT</span>}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: match.winner && match.winner === match.player1 ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      fontWeight: match.winner && match.winner === match.player1 ? 700 : 400,
                      color: match.winner && match.winner === match.player1 ? 'var(--accent-green)' : '#fff'
                    }}>
                      <span>{match.player1}</span>
                      <span>{match.score1}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: match.winner && match.winner === match.player2 ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      fontWeight: match.winner && match.winner === match.player2 ? 700 : 400,
                      color: match.winner && match.winner === match.player2 ? 'var(--accent-green)' : '#fff'
                    }}>
                      <span>{match.player2}</span>
                      <span>{match.score2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Semi Finals */}
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                color: 'var(--accent-cyan)',
                marginBottom: '16px',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                SEMI-FINALS (TOP 4)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', justifyContent: 'center', height: '80%' }}>
                {rounds['Semi-Finals'].map(match => (
                  <div 
                    key={match.matchId} 
                    className="glass-panel" 
                    onClick={() => handleOpenEditMatch(match)}
                    style={{ 
                      padding: '14px', 
                      borderRadius: 'var(--radius-sm)',
                      cursor: adminMode ? 'pointer' : 'default',
                      border: adminMode ? '1px dashed var(--accent-cyan)' : '1px solid var(--border-color)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>SEMI #{match.matchId} • BO3</span>
                      {adminMode && <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700 }}><Edit3 size={12} /> EDIT</span>}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: match.winner && match.winner === match.player1 ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      fontWeight: match.winner && match.winner === match.player1 ? 700 : 400,
                      color: match.winner && match.winner === match.player1 ? 'var(--accent-green)' : '#fff'
                    }}>
                      <span>{match.player1}</span>
                      <span>{match.score1}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: match.winner && match.winner === match.player2 ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      fontWeight: match.winner && match.winner === match.player2 ? 700 : 400,
                      color: match.winner && match.winner === match.player2 ? 'var(--accent-green)' : '#fff'
                    }}>
                      <span>{match.player2}</span>
                      <span>{match.score2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Grand Finals */}
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                color: 'var(--accent-gold)',
                marginBottom: '16px',
                textAlign: 'center',
                letterSpacing: '1px'
              }}>
                GRAND FINALS (CHAMPIONSHIP)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80%' }}>
                {rounds['Grand Final'].map(match => (
                  <div 
                    key={match.matchId} 
                    className="glass-panel" 
                    onClick={() => handleOpenEditMatch(match)}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      borderColor: 'var(--accent-gold)',
                      background: 'linear-gradient(135deg, rgba(255,183,3,0.1) 0%, rgba(18, 20, 32, 0.95) 100%)',
                      cursor: adminMode ? 'pointer' : 'default'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '12px', textAlign: 'center', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      <span>BEST OF 5 GRAND FINALS</span>
                      {adminMode && <span style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}><Edit3 size={14} /> EDIT</span>}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: match.winner && match.winner === match.player1 ? 'rgba(0, 230, 118, 0.2)' : 'rgba(0,0,0,0.4)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '10px',
                      color: match.winner && match.winner === match.player1 ? 'var(--accent-green)' : '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      <span>{match.player1}</span>
                      <span>{match.score1}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: match.winner && match.winner === match.player2 ? 'rgba(0, 230, 118, 0.2)' : 'rgba(0,0,0,0.4)',
                      borderRadius: 'var(--radius-sm)',
                      color: match.winner && match.winner === match.player2 ? 'var(--accent-green)' : '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}>
                      <span>{match.player2}</span>
                      <span>{match.score2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ORGANIZER EDIT MATCH MODAL */}
      {adminMode && editingMatch && (
        <div className="modal-overlay" onClick={() => setEditingMatch(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(230, 0, 57, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="var(--accent-red)" />
                <h3 style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                  ORGANIZER MATCH EDITOR — #{editingMatch.matchId} ({editingMatch.round})
                </h3>
              </div>
              <button onClick={() => setEditingMatch(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSaveMatch} style={{ padding: '20px' }}>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select registered players for {activeGameObj?.name} and enter their set scores:
              </div>

              {/* Player 1 Slot */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Player 1 (Registered Gamer Tag)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={player1}
                    onChange={e => setPlayer1(e.target.value)}
                    style={{
                      flex: 2,
                      padding: '10px 12px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="TBD">-- TBD (To Be Determined) --</option>
                    <option value="BYE">-- BYE (Automatic Seed Pass) --</option>
                    <optgroup label={`Registered ${activeGameObj?.name} Players`}>
                      {registeredGamePlayers.map(p => (
                        <option key={p.id} value={p.gamerTag}>
                          {p.gamerTag} ({p.fullName})
                        </option>
                      ))}
                    </optgroup>
                    {/* Fallback option if custom text previously existed */}
                    {!registeredGamePlayers.some(p => p.gamerTag === player1) && player1 !== 'TBD' && player1 !== 'BYE' && (
                      <option value={player1}>{player1}</option>
                    )}
                  </select>

                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={score1}
                    onChange={e => setScore1(e.target.value)}
                    style={{
                      width: '70px',
                      padding: '10px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  />
                </div>
              </div>

              {/* Player 2 Slot */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Player 2 (Registered Gamer Tag)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={player2}
                    onChange={e => setPlayer2(e.target.value)}
                    style={{
                      flex: 2,
                      padding: '10px 12px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="TBD">-- TBD (To Be Determined) --</option>
                    <option value="BYE">-- BYE (Automatic Seed Pass) --</option>
                    <optgroup label={`Registered ${activeGameObj?.name} Players`}>
                      {registeredGamePlayers.map(p => (
                        <option key={p.id} value={p.gamerTag}>
                          {p.gamerTag} ({p.fullName})
                        </option>
                      ))}
                    </optgroup>
                    {!registeredGamePlayers.some(p => p.gamerTag === player2) && player2 !== 'TBD' && player2 !== 'BYE' && (
                      <option value={player2}>{player2}</option>
                    )}
                  </select>

                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={score2}
                    onChange={e => setScore2(e.target.value)}
                    style={{
                      width: '70px',
                      padding: '10px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  />
                </div>
              </div>

              {/* Winner Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Set Match Winner (Advances to Next Round)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setWinner(player1)}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px',
                      fontSize: '0.82rem',
                      borderColor: winner === player1 && player1 !== 'TBD' ? 'var(--accent-green)' : 'transparent',
                      color: winner === player1 && player1 !== 'TBD' ? 'var(--accent-green)' : '#fff'
                    }}
                  >
                    P1: {player1 || 'P1'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWinner(player2)}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px',
                      fontSize: '0.82rem',
                      borderColor: winner === player2 && player2 !== 'TBD' ? 'var(--accent-green)' : 'transparent',
                      color: winner === player2 && player2 !== 'TBD' ? 'var(--accent-green)' : '#fff'
                    }}
                  >
                    P2: {player2 || 'P2'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWinner('')}
                    className="btn btn-secondary"
                    style={{
                      padding: '8px',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Clear Winner
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingMatch(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px' }}>
                  <CheckCircle size={16} /> SAVE BRACKET MATCH
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
