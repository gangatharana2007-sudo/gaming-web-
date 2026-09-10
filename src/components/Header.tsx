import React from 'react';
import { Trophy, Users, Wifi, WifiOff, PlusCircle, Shield, Gamepad2, ChevronDown } from 'lucide-react';
import { Tournament } from '../types';

interface HeaderProps {
  tournaments: Tournament[];
  activeTournament: Tournament | null;
  onSelectTournament: (id: string) => void;
  spectatorCount: number;
  isConnected: boolean;
  onOpenRegister: () => void;
  onOpenCreateTourney: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tournaments,
  activeTournament,
  onSelectTournament,
  spectatorCount,
  isConnected,
  onOpenRegister,
  onOpenCreateTourney,
  isAdminMode,
  onToggleAdminMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 ring-1 ring-white/20">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-wider text-white">
                  GAME<span className="text-rose-500">ARENA</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-widest">
                  Live Brackets
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">Tournament Operations & Real-Time Scoring</p>
            </div>
          </div>

          {/* Tournament Selector Dropdown */}
          <div className="relative group ml-2">
            <label htmlFor="tournament-select" className="sr-only">Select Tournament</label>
            <div className="flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
              <Gamepad2 className="h-4 w-4 text-rose-400 shrink-0" />
              <select
                id="tournament-select"
                value={activeTournament?.id || ''}
                onChange={(e) => onSelectTournament(e.target.value)}
                className="bg-transparent text-sm font-medium text-neutral-200 focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id} className="bg-neutral-900 text-neutral-200">
                    {t.title} ({t.game})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 pointer-events-none -ml-3" />
            </div>
          </div>
        </div>

        {/* Right side stats & actions */}
        <div className="flex items-center gap-3">
          {/* Connection status badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isConnected
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
            }`}
            title={isConnected ? 'Connected to live real-time server' : 'Reconnecting...'}
          >
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="h-3 w-3" />
                <span>Live Feed</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 animate-pulse" />
                <span>Syncing</span>
              </>
            )}
          </div>

          {/* Active Spectator count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <Users className="h-3.5 w-3.5 text-rose-400" />
            <span className="font-mono font-semibold text-white">{spectatorCount}</span>
            <span className="hidden sm:inline text-neutral-400">watching</span>
          </div>

          {/* Organizer / Referee Toggle */}
          <button
            id="admin-mode-toggle"
            onClick={onToggleAdminMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isAdminMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
            title={isAdminMode ? 'Referee / Scorekeeper mode active' : 'Switch to referee mode to record scores'}
          >
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isAdminMode ? 'Referee Mode' : 'Spectator'}</span>
          </button>

          {/* Player Registration CTA */}
          <button
            id="register-player-btn"
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Join Tourney</span>
          </button>
        </div>
      </div>
    </header>
  );
};
