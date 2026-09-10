import React from 'react';
import { Trophy, Calendar, MapPin, Award, Users, Play, RotateCcw, Plus, Radio, Flame } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentHeroProps {
  tournament: Tournament;
  activeTab: 'bracket' | 'players' | 'activity' | 'rules';
  onTabChange: (tab: 'bracket' | 'players' | 'activity' | 'rules') => void;
  isAdminMode: boolean;
  onResetBracket: () => void;
  onSimulateNext: () => void;
  onOpenCreateTourney: () => void;
  onOpenRegister: () => void;
}

export const TournamentHero: React.FC<TournamentHeroProps> = ({
  tournament,
  activeTab,
  onTabChange,
  isAdminMode,
  onResetBracket,
  onSimulateNext,
  onOpenCreateTourney,
  onOpenRegister
}) => {
  const isLive = tournament.status === 'live';
  const isRegistrationOpen = tournament.status === 'registration_open';
  const isCompleted = tournament.status === 'completed';

  return (
    <div className="relative w-full border-b border-neutral-800 bg-neutral-900/50">
      {/* Background Graphic / Banner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <img
          src={tournament.bannerUrl}
          alt={tournament.title}
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-neutral-800 text-rose-400 border border-neutral-700">
              {tournament.game} • {tournament.gameCategory}
            </span>

            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <Radio className="h-3 w-3" /> Live Now
              </span>
            )}

            {isRegistrationOpen && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Registration Open
              </span>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Award className="h-3.5 w-3.5" /> Tournament Concluded
              </span>
            )}

            <span className="text-xs text-neutral-400 font-mono hidden md:inline">
              Round: <strong className="text-neutral-200">{tournament.currentRound}</strong>
            </span>
          </div>

          {/* Organizer Quick Actions */}
          <div className="flex items-center gap-2">
            {isAdminMode && (
              <>
                <button
                  id="reset-bracket-btn"
                  onClick={onResetBracket}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                  title="Reset bracket matches back to initial state"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Bracket</span>
                </button>
                <button
                  id="simulate-match-btn"
                  onClick={onSimulateNext}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 transition-colors"
                  title="Simulate advance for the next ongoing match"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Simulate Next Match</span>
                </button>
              </>
            )}
            <button
              id="create-tourney-btn"
              onClick={onOpenCreateTourney}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">New Tournament</span>
            </button>
          </div>
        </div>

        {/* Title and Prize details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end mb-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tournament.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl">
              {tournament.description}
            </p>

            {/* Champion Banner if completed */}
            {tournament.champion && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/40 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/30 border border-amber-500/60 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">Tournament Champion</div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {tournament.champion.gamerTag}
                    {tournament.champion.teamTag && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        [{tournament.champion.teamTag}]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Card */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex-1 min-w-[110px]">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Award className="h-3.5 w-3.5 text-rose-400" />
                <span>Prize Pool</span>
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                {tournament.prizePool}
              </div>
            </div>

            <div className="w-[1px] bg-neutral-800 hidden sm:block" />

            <div className="flex-1 min-w-[110px]">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Users className="h-3.5 w-3.5 text-rose-400" />
                <span>Roster</span>
              </div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                {tournament.registeredCount} / {tournament.maxParticipants}
              </div>
            </div>

            <div className="w-[1px] bg-neutral-800 hidden sm:block" />

            <div className="flex-1 min-w-[110px]">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Format</span>
              </div>
              <div className="text-xs font-semibold text-neutral-200 mt-1 line-clamp-1">
                {tournament.format}
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Meta Strip: Dates, Location */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pb-4 border-b border-neutral-800/60">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
            <span>Started: {tournament.startDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neutral-500" />
            <span>{tournament.location}</span>
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-4 mt-4 overflow-x-auto">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-bracket"
              onClick={() => onTabChange('bracket')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'bracket'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              Interactive Bracket
            </button>

            <button
              id="tab-players"
              onClick={() => onTabChange('players')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'players'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <span>Player Profiles</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-neutral-800 text-neutral-300 font-mono">
                {tournament.participants.length}
              </span>
            </button>

            <button
              id="tab-activity"
              onClick={() => onTabChange('activity')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'activity'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <span>Live Ticker & Logs</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            </button>

            <button
              id="tab-rules"
              onClick={() => onTabChange('rules')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              Rules & Schedule
            </button>
          </nav>

          {/* Quick Register button in tab row if open */}
          {isRegistrationOpen && (
            <button
              id="hero-register-btn"
              onClick={onOpenRegister}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-colors shadow-sm shadow-emerald-600/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Now ({tournament.maxParticipants - tournament.registeredCount} spots left)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
