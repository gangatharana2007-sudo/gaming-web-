import React, { useState, useMemo } from 'react';
import { Search, Trophy, CheckCircle2, Clock, Filter, ShieldCheck, UserCheck, Flame, ArrowUpRight } from 'lucide-react';
import { PlayerProfile, Tournament } from '../types';

interface ParticipantsListProps {
  tournament: Tournament;
  onSelectPlayer: (player: PlayerProfile) => void;
  onToggleCheckIn: (playerId: string, isChecked: boolean) => void;
  isAdminMode: boolean;
  onOpenRegister: () => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  tournament,
  onSelectPlayer,
  onToggleCheckIn,
  isAdminMode,
  onOpenRegister
}) => {
  const [search, setSearch] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState<'all' | 'checked' | 'pending'>('all');

  const participants = tournament.participants;

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchQuery =
        p.gamerTag.toLowerCase().includes(search.toLowerCase()) ||
        p.realName.toLowerCase().includes(search.toLowerCase()) ||
        (p.team?.name && p.team.name.toLowerCase().includes(search.toLowerCase())) ||
        p.rankTier.toLowerCase().includes(search.toLowerCase());

      if (!matchQuery) return false;
      if (filterCheckIn === 'checked') return p.isCheckedIn;
      if (filterCheckIn === 'pending') return !p.isCheckedIn;
      return true;
    });
  }, [participants, search, filterCheckIn]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Tournament Roster & Player Profiles</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              {participants.length} / {tournament.maxParticipants}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Verified competitive player profiles with live win/loss records and check-in statuses.
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tag, team, rank..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setFilterCheckIn('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterCheckIn === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All ({participants.length})
            </button>
            <button
              onClick={() => setFilterCheckIn('checked')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterCheckIn === 'checked'
                  ? 'bg-neutral-800 text-emerald-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Checked In
            </button>
            <button
              onClick={() => setFilterCheckIn('pending')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterCheckIn === 'pending'
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Players */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((player, index) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="group p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900 transition-all cursor-pointer shadow-sm relative overflow-hidden"
            >
              {/* Seed/Number Ribbon */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  Seed #{index + 1}
                </span>
                {player.isCheckedIn ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Checked In" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-amber-500" title="Awaiting Check-in" />
                )}
              </div>

              {/* Player Avatar & Identity */}
              <div className="flex items-start gap-3.5">
                <div className="relative">
                  <div className="h-14 w-14 rounded-xl ring-2 ring-neutral-700/80 group-hover:ring-rose-500/50 overflow-hidden bg-neutral-800 shrink-0 transition-all">
                    <img
                      src={player.avatar}
                      alt={player.gamerTag}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-neutral-950 border border-neutral-700 text-neutral-300">
                    {player.country.code}
                  </span>
                </div>

                <div className="min-w-0 flex-1 pr-12">
                  <div className="flex items-center gap-1.5 truncate">
                    <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                      {player.gamerTag}
                    </h3>
                    {player.team && (
                      <span className="text-xs font-mono text-neutral-400 shrink-0">
                        [{player.team.tag}]
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {player.realName}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-800 text-rose-300 border border-neutral-700/60">
                      {player.rankTier}
                    </span>
                    <span className="text-[11px] text-neutral-500 truncate">
                      {player.mainGame}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/60 text-center">
                <div className="p-1.5 rounded-lg bg-neutral-950/60">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Win Rate</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    {player.winLoss.winRate}%
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-neutral-950/60">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Record</div>
                  <div className="text-xs font-mono font-bold text-neutral-300 mt-0.5">
                    {player.winLoss.wins}W - {player.winLoss.losses}L
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-neutral-950/60">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Trophies</div>
                  <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                    {player.tournamentStats.championships} 🏆
                  </div>
                </div>
              </div>

              {/* Card Footer: Check-in toggle & View button */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCheckIn(player.id, !player.isCheckedIn);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    player.isCheckedIn
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="h-3 w-3" />
                  <span>{player.isCheckedIn ? 'Checked In' : 'Check In'}</span>
                </button>

                <div className="flex items-center gap-0.5 text-neutral-400 group-hover:text-white font-medium text-[11px]">
                  <span>Profile</span>
                  <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <p className="text-sm text-neutral-400">No participants matching your search query.</p>
          <button
            onClick={() => {
              setSearch('');
              setFilterCheckIn('all');
            }}
            className="mt-3 text-xs text-rose-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
