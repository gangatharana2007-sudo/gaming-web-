import React, { useState } from 'react';
import { X, Trophy, Award, Flame, Swords, Shield, Copy, Check, ExternalLink, Calendar, Gamepad } from 'lucide-react';
import { PlayerProfile } from '../types';

interface PlayerProfileModalProps {
  player: PlayerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleCheckIn?: (playerId: string, isChecked: boolean) => void;
  isAdminMode?: boolean;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  player,
  isOpen,
  onClose,
  onToggleCheckIn,
  isAdminMode
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !player) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-r from-rose-950/40 via-neutral-900 to-neutral-900 border-b border-neutral-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ring-4 ring-rose-500/30 overflow-hidden bg-neutral-800 shadow-xl shrink-0">
                <img
                  src={player.avatar}
                  alt={player.gamerTag}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-700 text-neutral-300 shadow">
                {player.country.code}
              </span>
            </div>

            {/* Identity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {player.gamerTag}
                </h2>
                {player.team && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-neutral-800 text-rose-400 border border-neutral-700">
                    [{player.team.tag}] {player.team.name}
                  </span>
                )}
                {player.isCheckedIn ? (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Checked In
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pending Check-in
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-neutral-400">
                <span>{player.realName}</span>
                <span>•</span>
                <span>{player.country.name}</span>
                <span>•</span>
                <span className="text-rose-400 font-semibold">{player.mainGame}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono font-bold">
                  {player.rankTier}
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-neutral-300 line-clamp-2">
                {player.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Win Rate */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Win Rate</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {player.winLoss.winRate}%
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                {player.winLoss.wins}W - {player.winLoss.losses}L
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, player.winLoss.winRate)}%` }}
                />
              </div>
            </div>

            {/* Championships */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>Trophies</span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {player.tournamentStats.championships}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                {player.tournamentStats.runnerUp} Runner-ups
              </div>
            </div>

            {/* Tournaments Played */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Gamepad className="h-3.5 w-3.5 text-blue-400" />
                <span>Tourneys</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {player.tournamentStats.tournamentsPlayed}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Events entered
              </div>
            </div>

            {/* Career Prize Money */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span>Prize Won</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                ${player.tournamentStats.totalPrizeWon.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Career earnings
              </div>
            </div>
          </div>

          {/* Social & Contact IDs */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Player Handles & Credentials
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {player.socialDiscord && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-neutral-300">Discord:</span>
                    <span className="font-mono text-neutral-400 truncate">{player.socialDiscord}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(player.socialDiscord!, 'discord')}
                    className="p-1 text-neutral-400 hover:text-white transition-colors ml-2 shrink-0"
                    title="Copy Discord Tag"
                  >
                    {copiedField === 'discord' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}

              {player.socialSteamOrRiot && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-neutral-300">In-Game ID:</span>
                    <span className="font-mono text-neutral-400 truncate">{player.socialSteamOrRiot}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(player.socialSteamOrRiot!, 'riot')}
                    className="p-1 text-neutral-400 hover:text-white transition-colors ml-2 shrink-0"
                    title="Copy Game ID"
                  >
                    {copiedField === 'riot' ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Match History Log */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
              <span>Recent Match History</span>
              <span className="font-mono text-neutral-400 font-normal">
                {player.matchHistory.length} Recorded
              </span>
            </h4>

            {player.matchHistory.length > 0 ? (
              <div className="space-y-2">
                {player.matchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold font-mono ${
                          item.result === 'W'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {item.result}
                      </span>
                      <div>
                        <div className="font-semibold text-neutral-200">
                          vs {item.opponentTag}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>{item.tournamentName}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-bold text-sm text-white">
                      {item.score}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-neutral-950 text-center text-xs text-neutral-400">
                No previous matches recorded yet. Ready for debut!
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>

          {isAdminMode && onToggleCheckIn && (
            <button
              onClick={() => onToggleCheckIn(player.id, !player.isCheckedIn)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                player.isCheckedIn
                  ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
              }`}
            >
              {player.isCheckedIn ? 'Revoke Check-In' : 'Confirm Check-In'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
