import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GameCards from './components/GameCards';
import PracticeSessionPortal from './components/PracticeSessionPortal';
import TournamentBrackets from './components/TournamentBrackets';
import AdminDashboard from './components/AdminDashboard';
import RegistrationModal from './components/RegistrationModal';
import PlayerPassModal from './components/PlayerPassModal';
import Footer from './components/Footer';

import { INITIAL_BRACKETS } from './data/initialData';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [brackets, setBrackets] = useState(INITIAL_BRACKETS);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const [activeTab, setActiveTab] = useState('home');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedGameForRegister, setSelectedGameForRegister] = useState('dbz');
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [activePlayerPass, setActivePlayerPass] = useState(null);
  const [adminMode, setAdminMode] = useState(false);

  // ─── Load data from API on mount ─────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [playersRes, bracketsRes] = await Promise.all([
          fetch('/api/players'),
          fetch('/api/brackets'),
        ]);

        if (!playersRes.ok || !bracketsRes.ok) {
          throw new Error('Failed to load data from server.');
        }

        const [playersData, bracketsData] = await Promise.all([
          playersRes.json(),
          bracketsRes.json(),
        ]);

        setPlayers(playersData);
        setBrackets(bracketsData);
        setApiError('');

        // Restore saved pass on this device if previously unlocked
        const savedPassId = localStorage.getItem('evo_my_unlocked_player_id');
        if (savedPassId) {
          const found = playersData.find(p => p.id === savedPassId);
          if (found) setActivePlayerPass(found);
        }
      } catch (err) {
        console.error('[App] load error:', err);
        setApiError('⚠️  Could not connect to the backend server. Make sure it is running with: npm run dev:all');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ─── Open registration modal ──────────────────────────────────────────────
  const handleOpenRegisterForGame = (gameId = 'dbz') => {
    setSelectedGameForRegister(gameId);
    setIsRegisterOpen(true);
  };

  // ─── Called after a successful POST /api/players ─────────────────────────
  const handleCompleteRegistration = (newPlayer) => {
    setPlayers(prev => [newPlayer, ...prev]);
    setIsRegisterOpen(false);
    
    // Save unlocked pass ID to device
    localStorage.setItem('evo_my_unlocked_player_id', newPlayer.id);
    setActivePlayerPass(newPlayer);
    setIsPassOpen(true);
  };

  // ─── Called when player authenticates their pass ──────────────────────────
  const handleUnlockPass = (player) => {
    localStorage.setItem('evo_my_unlocked_player_id', player.id);
    setActivePlayerPass(player);
  };

  // ─── Called when player locks/clears their pass ───────────────────────────
  const handleClearPass = () => {
    localStorage.removeItem('evo_my_unlocked_player_id');
    setActivePlayerPass(null);
  };

  // ─── Called by admin dashboard when it mutates players ───────────────────
  const handleUpdatePlayers = (updatedPlayers) => {
    setPlayers(updatedPlayers);
  };

  // ─── Update bracket match (Organizer only) ───────────────────────────────
  const handleUpdateMatch = async (gameId, matchId, updatedFields) => {
    try {
      const res = await fetch(`/api/brackets/${gameId}/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const updatedMatch = await res.json();
        setBrackets(prev => ({
          ...prev,
          [gameId]: (prev[gameId] || []).map(m => m.matchId === Number(matchId) ? updatedMatch : m)
        }));
      }
    } catch (err) {
      console.error('[App] handleUpdateMatch error:', err);
    }
  };

  // ─── Open player pass viewer ──────────────────────────────────────────────
  const handleOpenMyPass = () => {
    const savedPassId = localStorage.getItem('evo_my_unlocked_player_id');
    if (savedPassId) {
      const found = players.find(p => p.id === savedPassId);
      if (found) setActivePlayerPass(found);
    }
    setIsPassOpen(true);
  };

  // ─── Loading / error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-dark)', color: 'var(--text-muted)',
        gap: '16px', fontFamily: 'var(--font-body)'
      }}>
        <div style={{ fontSize: '2rem' }}>🔥</div>
        <div style={{ fontSize: '1.1rem' }}>Loading EVO FGC Competition...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* API connection error banner */}
      {apiError && (
        <div style={{
          background: 'rgba(230, 0, 57, 0.9)',
          color: '#fff',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 600,
          zIndex: 9999,
        }}>
          {apiError}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenRegister={() => handleOpenRegisterForGame('dbz')}
        onOpenMyPass={handleOpenMyPass}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        adminMode={adminMode}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            <HeroSection
              onOpenRegister={() => handleOpenRegisterForGame('dbz')}
              onSelectTab={setActiveTab}
            />
            <GameCards
              players={players}
              onRegisterGame={handleOpenRegisterForGame}
              onSelectTab={setActiveTab}
            />
            <PracticeSessionPortal
              players={players}
              onOpenRegister={() => handleOpenRegisterForGame('dbz')}
              onOpenMyPass={handleOpenMyPass}
            />
            <TournamentBrackets
              brackets={brackets}
              players={players}
              adminMode={adminMode}
              onUpdateMatch={handleUpdateMatch}
            />
          </>
        )}

        {activeTab === 'practice' && (
          <PracticeSessionPortal
            players={players}
            onOpenRegister={() => handleOpenRegisterForGame('dbz')}
            onOpenMyPass={handleOpenMyPass}
          />
        )}

        {activeTab === 'brackets' && (
          <TournamentBrackets
            brackets={brackets}
            players={players}
            adminMode={adminMode}
            onUpdateMatch={handleUpdateMatch}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            players={players}
            onUpdatePlayers={handleUpdatePlayers}
            adminMode={adminMode}
            onToggleAdmin={setAdminMode}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenRegister={() => handleOpenRegisterForGame('dbz')}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        selectedGameId={selectedGameForRegister}
        players={players}
        onCompleteRegistration={handleCompleteRegistration}
      />

      {/* Player Ticket / Pass Modal */}
      <PlayerPassModal
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
        playerPass={activePlayerPass}
        players={players}
        onUnlockPass={handleUnlockPass}
        onClearPass={handleClearPass}
      />

    </div>
  );
}
