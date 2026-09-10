import React, { useState, useEffect } from 'react';
import { X, Trophy, Radio, CheckCircle2, Shield, Plus, Minus, ExternalLink, Save, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Match, MatchParticipant } from '../types';

interface MatchDetailModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onUpdateMatch: (updatedMatch: Match) => void;
  onSelectPlayerTag: (tag: string) => void;
  isAdminMode: boolean;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  onUpdateMatch,
  onSelectPlayerTag,
  isAdminMode
}) => {
  const [p1Score, setP1Score] = useState(match.participant1.score);
  const [p2Score, setP2Score] = useState(match.participant2.score);
  const [status, setStatus] = useState<Match['status']>(match.status);
  const [liveNotes, setLiveNotes] = useState(match.liveNotes || '');
  const [gameMap, setGameMap] = useState(match.gameMap || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever selected match changes
  useEffect(() => {
    setP1Score(match.participant1.score);
    setP2Score(match.participant2.score);
    setStatus(match.status);
    setLiveNotes(match.liveNotes || '');
    setGameMap(match.gameMap || '');
  }, [match]);

  if (!isOpen) return null;

  const isTBD =
    match.participant1.gamerTag.startsWith('TBD') ||
    match.participant2.gamerTag.startsWith('TBD');

  const handleSaveScore = async () => {
    setIsSubmitting(true);

    const isCompleted = status === 'completed';
    let winnerId: string | undefined = undefined;
    let winnerTag: string | undefined = undefined;

    let p1IsWinner = false;
    let p2IsWinner = false;

    if (isCompleted) {
      if (p1Score > p2Score) {
        p1IsWinner = true;
        winnerId = match.participant1.playerId;
        winnerTag = match.participant1.gamerTag;
      } else if (p2Score > p1Score) {
        p2IsWinner = true;
        winnerId = match.participant2.playerId;
        winnerTag = match.participant2.gamerTag;
      }

      // Fire victory confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if confetti fails
      }
    }

    const updatedMatch: Match = {
      ...match,
      status,
      gameMap,
      liveNotes,
      participant1: {
        ...match.participant1,
        score: p1Score,
        isWinner: p1IsWinner
      },
      participant2: {
        ...match.participant2,
        score: p2Score,
        isWinner: p2IsWinner
      },
      winnerId,
      winnerTag,
      updatedAt: new Date().toISOString()
    };

    await onUpdateMatch(updatedMatch);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                {match.roundName}
              </span>
              <span className="text-xs text-neutral-400 font-mono">Match #{match.matchNumber}</span>
              <span className="text-xs text-neutral-400 font-mono">• Best of {match.bestOf}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Match Command & Score Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Match Score Display / Editor */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="grid grid-cols-7 items-center gap-3 text-center">
              {/* Participant 1 */}
              <div className="col-span-3 flex flex-col items-center">
                <div className="h-14 w-14 rounded-xl bg-neutral-800 ring-2 ring-neutral-700 overflow-hidden mb-2 shadow-md">
                  {match.participant1.avatar ? (
                    <img
                      src={match.participant1.avatar}
                      alt={match.participant1.gamerTag}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500 text-sm">
                      {match.participant1.seed ? `#${match.participant1.seed}` : 'TBD'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!match.participant1.gamerTag.startsWith('TBD')) {
                      onSelectPlayerTag(match.participant1.gamerTag);
                    }
                  }}
                  className="font-bold text-sm text-white hover:text-rose-400 transition-colors truncate max-w-full"
                >
                  {match.participant1.gamerTag}
                </button>

                {match.participant1.teamTag && (
                  <span className="text-xs font-mono text-neutral-400">
                    [{match.participant1.teamTag}]
                  </span>
                )}

                {/* Score Controls */}
                {isAdminMode && !isTBD && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <button
                      onClick={() => setP1Score((s) => Math.max(0, s - 1))}
                      className="h-7 w-7 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-neutral-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 font-mono font-extrabold text-xl text-white">
                      {p1Score}
                    </span>
                    <button
                      onClick={() => setP1Score((s) => s + 1)}
                      className="h-7 w-7 rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {!isAdminMode && (
                  <span className="mt-3 text-3xl font-extrabold font-mono text-white">
                    {match.participant1.score}
                  </span>
                )}
              </div>

              {/* VS Divider */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                  VS
                </span>
                <span className="text-[10px] text-neutral-400 font-mono mt-2">
                  First to {Math.ceil(match.bestOf / 2)}
                </span>
              </div>

              {/* Participant 2 */}
              <div className="col-span-3 flex flex-col items-center">
                <div className="h-14 w-14 rounded-xl bg-neutral-800 ring-2 ring-neutral-700 overflow-hidden mb-2 shadow-md">
                  {match.participant2.avatar ? (
                    <img
                      src={match.participant2.avatar}
                      alt={match.participant2.gamerTag}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500 text-sm">
                      {match.participant2.seed ? `#${match.participant2.seed}` : 'TBD'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!match.participant2.gamerTag.startsWith('TBD')) {
                      onSelectPlayerTag(match.participant2.gamerTag);
                    }
                  }}
                  className="font-bold text-sm text-white hover:text-rose-400 transition-colors truncate max-w-full"
                >
                  {match.participant2.gamerTag}
                </button>

                {match.participant2.teamTag && (
                  <span className="text-xs font-mono text-neutral-400">
                    [{match.participant2.teamTag}]
                  </span>
                )}

                {/* Score Controls */}
                {isAdminMode && !isTBD && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <button
                      onClick={() => setP2Score((s) => Math.max(0, s - 1))}
                      className="h-7 w-7 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors border border-neutral-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 font-mono font-extrabold text-xl text-white">
                      {p2Score}
                    </span>
                    <button
                      onClick={() => setP2Score((s) => s + 1)}
                      className="h-7 w-7 rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {!isAdminMode && (
                  <span className="mt-3 text-3xl font-extrabold font-mono text-white">
                    {match.participant2.score}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Referee Mode Controls */}
          {isAdminMode ? (
            <div className="space-y-4 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Shield className="h-4 w-4" /> Referee Official Controls
              </div>

              {/* Status Radio Buttons */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                  Match Status:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('scheduled')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      status === 'scheduled'
                        ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('live')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      status === 'live'
                        ? 'bg-rose-600/30 text-rose-300 border-rose-500 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <Radio className="h-3.5 w-3.5" /> Live Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('completed')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      status === 'completed'
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Final / End
                  </button>
                </div>
              </div>

              {/* Game Map / Mode */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">
                  Map / Arena Details:
                </label>
                <input
                  type="text"
                  value={gameMap}
                  onChange={(e) => setGameMap(e.target.value)}
                  placeholder="e.g. Ascent, Haven (Map 3 Decider)"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Referee Notes / Live Commentary Ticker */}
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">
                  Referee Live Ticker Notes:
                </label>
                <input
                  type="text"
                  value={liveNotes}
                  onChange={(e) => setLiveNotes(e.target.value)}
                  placeholder="e.g. Valkyrie on match point with 24 kills"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          ) : (
            /* Spectator View details */
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Scheduled Time</span>
                <span className="font-mono text-neutral-200">{match.scheduledTime}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Map / Decider</span>
                <span className="text-neutral-200">{match.gameMap || 'Standard Competitive'}</span>
              </div>
              {match.streamUrl && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
                  <span className="text-neutral-400">Official Stream</span>
                  <a
                    href={match.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    <span>Watch Live</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>

          {isAdminMode ? (
            <button
              onClick={handleSaveScore}
              disabled={isSubmitting || isTBD}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Syncing...' : 'Broadcast Match Update'}</span>
            </button>
          ) : (
            <div className="text-xs text-neutral-400">
              Live updates broadcasted via GameArena Realtime
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
