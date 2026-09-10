import React, { useState } from 'react';
import { useTournamentHub } from './useTournamentHub';
import { Header } from './components/Header';
import { LiveScoreTicker } from './components/LiveScoreTicker';
import { TournamentHero } from './components/TournamentHero';
import { BracketView } from './components/BracketView';
import { ParticipantsList } from './components/ParticipantsList';
import { ActivityFeed } from './components/ActivityFeed';
import { RulesAndSchedule } from './components/RulesAndSchedule';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { RegistrationModal } from './components/RegistrationModal';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { Match, PlayerProfile } from './types';
import { Trophy, Shield, Wifi, Heart } from 'lucide-react';

export default function App() {
  const {
    tournaments,
    activeTournament,
    activeTournamentId,
    setActiveTournamentId,
    spectatorCount,
    activityFeed,
    allPlayers,
    isConnected,
    updateMatch,
    registerPlayer,
    toggleCheckIn,
    resetBracket,
    simulateNextMatch,
    createTournament
  } = useTournamentHub();

  const [activeTab, setActiveTab] = useState<'bracket' | 'players' | 'activity' | 'rules'>('bracket');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // Default to referee mode so user can test scores immediately!
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isCreateTourneyOpen, setIsCreateTourneyOpen] = useState<boolean>(false);

  // Helper to open player modal by gamer tag
  const handleSelectPlayerTag = (tag: string) => {
    // Search in all players
    const found = allPlayers.find(
      (p) => p.gamerTag.toLowerCase() === tag.toLowerCase()
    );
    if (found) {
      setSelectedPlayer(found);
    } else {
      // Temporary fallback profile if tag is newly seeded
      const fallback: PlayerProfile = {
        id: `p-${tag}`,
        gamerTag: tag,
        realName: `${tag} Competitor`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${tag}`,
        country: { code: 'INT', name: 'International' },
        mainGame: activeTournament?.game || 'Competitive eSports',
        rankTier: 'Challenger',
        bio: `Professional competitor representing ${tag} in ${activeTournament?.title}.`,
        winLoss: { wins: 12, losses: 4, winRate: 75 },
        tournamentStats: { tournamentsPlayed: 5, championships: 1, runnerUp: 1, totalPrizeWon: 8500 },
        matchHistory: [],
        isCheckedIn: true,
        registeredAt: new Date().toISOString()
      };
      setSelectedPlayer(fallback);
    }
  };

  const handleSelectTickerMatch = (tournamentId: string, match: Match) => {
    setActiveTournamentId(tournamentId);
    setSelectedMatch(match);
  };

  if (!activeTournament) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Trophy className="h-8 w-8 text-rose-500" />
          <span>Loading Tournament Grid...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-rose-500 selection:text-white">
      {/* Top Global Header */}
      <Header
        tournaments={tournaments}
        activeTournament={activeTournament}
        onSelectTournament={(id) => setActiveTournamentId(id)}
        spectatorCount={spectatorCount}
        isConnected={isConnected}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCreateTourney={() => setIsCreateTourneyOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
      />

      {/* Live Match Ticker Strip */}
      <LiveScoreTicker
        tournaments={tournaments}
        onSelectMatch={handleSelectTickerMatch}
      />

      {/* Main Tournament Hero & Tab Bar */}
      <TournamentHero
        tournament={activeTournament}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        isAdminMode={isAdminMode}
        onResetBracket={resetBracket}
        onSimulateNext={simulateNextMatch}
        onOpenCreateTourney={() => setIsCreateTourneyOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Tab Content Stage */}
      <main className="flex-1 w-full">
        {activeTab === 'bracket' && (
          <BracketView
            tournament={activeTournament}
            onSelectMatch={(match) => setSelectedMatch(match)}
            onSelectPlayerTag={handleSelectPlayerTag}
            isAdminMode={isAdminMode}
          />
        )}

        {activeTab === 'players' && (
          <ParticipantsList
            tournament={activeTournament}
            onSelectPlayer={(player) => setSelectedPlayer(player)}
            onToggleCheckIn={toggleCheckIn}
            isAdminMode={isAdminMode}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityFeed
            items={activityFeed}
            currentTournamentId={activeTournament.id}
          />
        )}

        {activeTab === 'rules' && (
          <RulesAndSchedule tournament={activeTournament} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800/80 bg-neutral-950/80 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white tracking-wider">
              GAME<span className="text-rose-500">ARENA</span> HUB
            </span>
            <span>•</span>
            <span>Real-Time eSports Bracket & Player Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isConnected ? 'Realtime Connected' : 'Syncing state...'}</span>
            </div>
            <span>•</span>
            <span>Referee Mode: {isAdminMode ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedMatch && (
        <MatchDetailModal
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onUpdateMatch={updateMatch}
          onSelectPlayerTag={handleSelectPlayerTag}
          isAdminMode={isAdminMode}
        />
      )}

      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onToggleCheckIn={toggleCheckIn}
          isAdminMode={isAdminMode}
        />
      )}

      {isRegisterOpen && (
        <RegistrationModal
          tournament={activeTournament}
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegister={registerPlayer}
        />
      )}

      {isCreateTourneyOpen && (
        <CreateTournamentModal
          isOpen={isCreateTourneyOpen}
          onClose={() => setIsCreateTourneyOpen(false)}
          onCreateTournament={createTournament}
        />
      )}
    </div>
  );
}
