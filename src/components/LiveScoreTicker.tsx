import React from 'react';
import { Radio, ChevronRight, Trophy } from 'lucide-react';
import { Tournament, Match } from '../types';

interface LiveScoreTickerProps {
  tournaments: Tournament[];
  onSelectMatch: (tournamentId: string, match: Match) => void;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({
  tournaments,
  onSelectMatch
}) => {
  // Extract all live and recently completed matches
  const liveMatches: { tourney: Tournament; match: Match }[] = [];
  tournaments.forEach((tourney) => {
    tourney.matches.forEach((match) => {
      if (match.status === 'live' || (match.status === 'completed' && match.winnerTag)) {
        liveMatches.push({ tourney, match });
      }
    });
  });

  if (liveMatches.length === 0) return null;

  return (
    <div className="w-full bg-neutral-950 border-b border-neutral-800/80 overflow-x-auto py-2 px-4 select-none scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-4 min-w-max">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span>Match Ticker</span>
        </div>

        <div className="h-4 w-[1px] bg-neutral-800 shrink-0" />

        <div className="flex items-center gap-3">
          {liveMatches.map(({ tourney, match }) => {
            const isLive = match.status === 'live';

            return (
              <button
                key={`${tourney.id}-${match.id}`}
                onClick={() => onSelectMatch(tourney.id, match)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                  isLive
                    ? 'bg-rose-950/20 border-rose-500/40 text-neutral-200 hover:border-rose-400'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  {tourney.game}
                </span>

                <div className="flex items-center gap-2 font-mono">
                  <span className={`font-semibold ${match.participant1.isWinner ? 'text-rose-400' : 'text-neutral-300'}`}>
                    {match.participant1.gamerTag}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-neutral-950 font-bold text-white text-[11px] border border-neutral-800">
                    {match.participant1.score} - {match.participant2.score}
                  </span>
                  <span className={`font-semibold ${match.participant2.isWinner ? 'text-rose-400' : 'text-neutral-300'}`}>
                    {match.participant2.gamerTag}
                  </span>
                </div>

                {isLive ? (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded">
                    LIVE
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                    FINAL
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
