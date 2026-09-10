import React from 'react';
import { Trophy, Radio, Clock, CheckCircle2, ChevronRight, Swords, ShieldAlert } from 'lucide-react';
import { Match, MatchParticipant, Tournament } from '../types';

interface BracketViewProps {
  tournament: Tournament;
  onSelectMatch: (match: Match) => void;
  onSelectPlayerTag: (tag: string) => void;
  isAdminMode: boolean;
}

export const BracketView: React.FC<BracketViewProps> = ({
  tournament,
  onSelectMatch,
  onSelectPlayerTag,
  isAdminMode
}) => {
  const matches = tournament.matches;

  // Group matches by round
  const rounds = React.useMemo(() => {
    const map = new Map<number, Match[]>();
    matches.forEach((m) => {
      const list = map.get(m.round) || [];
      list.push(m);
      map.set(m.round, list);
    });
    // Sort rounds ascending
    return Array.from(map.entries()).sort(([r1], [r2]) => r1 - r2);
  }, [matches]);

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mb-4">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Tournament Registration in Progress</h3>
        <p className="text-neutral-400 mt-2 max-w-md mx-auto text-sm">
          Brackets will be automatically seeded once player registrations reach capacity or when the tournament organizer initiates the bracket draw.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
            {tournament.registeredCount} / {tournament.maxParticipants} Registered
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Organizer helper banner if in admin mode */}
      {isAdminMode && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                <strong>Referee / Organizer Mode Active:</strong> Click any match card to update live scores, change status (Live/Completed), or advance winners.
              </span>
            </div>
            <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded">Click any card to edit</span>
          </div>
        </div>
      )}

      {/* Bracket Stage Container with Horizontal Scroll */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto pb-8">
        <div className="inline-flex items-stretch gap-8 sm:gap-12 min-w-full justify-start lg:justify-center py-4">
          {rounds.map(([roundNumber, roundMatches], roundIdx) => {
            const roundTitle = roundMatches[0]?.roundName || `Round ${roundNumber}`;
            const isGrandFinal = roundIdx === rounds.length - 1;

            return (
              <div key={roundNumber} className="flex flex-col min-w-[280px] sm:min-w-[320px] max-w-[340px]">
                {/* Round Header */}
                <div className="mb-4 pb-2 border-b border-neutral-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold tracking-wider uppercase text-white font-display">
                      {roundTitle}
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'} • Best of {roundMatches[0]?.bestOf || 3}
                    </span>
                  </div>
                  {isGrandFinal && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Trophy className="h-3 w-3" /> Championship
                    </span>
                  )}
                </div>

                {/* Matches Column */}
                <div className="flex-1 flex flex-col justify-around gap-6 py-2">
                  {roundMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => onSelectMatch(match)}
                      onSelectPlayerTag={onSelectPlayerTag}
                      isAdminMode={isAdminMode}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Champion Stage / Podium display */}
          <div className="flex flex-col min-w-[240px] max-w-[260px] justify-center">
            <div className="mb-4 pb-2 border-b border-neutral-800">
              <h3 className="text-sm font-bold tracking-wider uppercase text-amber-400 font-display flex items-center gap-1.5">
                <Trophy className="h-4 w-4" /> Champion
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">First Place & Trophy</span>
            </div>

            <div className="h-full flex flex-col justify-center">
              {tournament.champion ? (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-neutral-900/90 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 text-center relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors pointer-events-none">
                    <Trophy className="w-32 h-32" />
                  </div>

                  <div className="relative">
                    <div className="mx-auto h-20 w-20 rounded-full ring-4 ring-amber-400/60 overflow-hidden shadow-lg mb-3 bg-neutral-800">
                      <img
                        src={tournament.champion.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80'}
                        alt={tournament.champion.gamerTag}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-neutral-950 mb-1">
                      1st Place
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-wide">
                      {tournament.champion.gamerTag}
                    </h4>

                    {tournament.champion.teamTag && (
                      <p className="text-xs text-amber-300/80 font-mono font-medium">
                        [{tournament.champion.teamTag}]
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-amber-500/30 text-xs text-neutral-300">
                      <span className="text-neutral-400 text-[10px] uppercase tracking-wider block">Purse Award</span>
                      <strong className="text-amber-400 text-sm font-mono">{tournament.prizePool}</strong>
                    </div>

                    <button
                      onClick={() => onSelectPlayerTag(tournament.champion!.gamerTag)}
                      className="mt-3 w-full py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 border-dashed text-center flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600 mb-2">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-semibold text-neutral-400">Awaiting Grand Final</div>
                  <div className="text-[11px] text-neutral-600 mt-1">Champion crowned after final series</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  onSelectPlayerTag: (tag: string) => void;
  isAdminMode: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onClick,
  onSelectPlayerTag,
  isAdminMode
}) => {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  const p1 = match.participant1;
  const p2 = match.participant2;

  const isP1Winner = isCompleted && p1.isWinner;
  const isP2Winner = isCompleted && p2.isWinner;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl transition-all cursor-pointer border ${
        isLive
          ? 'bg-neutral-900/90 border-rose-500/70 shadow-lg shadow-rose-500/10 hover:border-rose-400 ring-1 ring-rose-500/30'
          : isCompleted
          ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
          : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700'
      }`}
    >
      {/* Header bar */}
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-neutral-800/60 text-[11px]">
        <div className="flex items-center gap-1.5 font-mono text-neutral-400">
          <span>Match #{match.matchNumber}</span>
          {match.gameMap && (
            <>
              <span>•</span>
              <span className="text-neutral-300 truncate max-w-[110px]">{match.gameMap}</span>
            </>
          )}
        </div>

        {/* Status Indicator */}
        <div>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
              </span>
              <Radio className="h-2.5 w-2.5" /> LIVE
            </span>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Final
            </span>
          )}

          {!isLive && !isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
              <Clock className="h-2.5 w-2.5 text-neutral-500" />
              <span>{match.scheduledTime}</span>
            </span>
          )}
        </div>
      </div>

      {/* Participants Rows */}
      <div className="p-2.5 space-y-1.5">
        {/* Participant 1 */}
        <ParticipantRow
          participant={p1}
          isWinner={isP1Winner}
          isLoser={isCompleted && !isP1Winner}
          isLive={isLive}
          onSelectTag={(e) => {
            e.stopPropagation();
            if (!p1.gamerTag.startsWith('TBD')) onSelectPlayerTag(p1.gamerTag);
          }}
        />

        {/* Participant 2 */}
        <ParticipantRow
          participant={p2}
          isWinner={isP2Winner}
          isLoser={isCompleted && !isP2Winner}
          isLive={isLive}
          onSelectTag={(e) => {
            e.stopPropagation();
            if (!p2.gamerTag.startsWith('TBD')) onSelectPlayerTag(p2.gamerTag);
          }}
        />
      </div>

      {/* Footer Strip with Live Notes or Click Action */}
      <div className="px-3 py-1.5 bg-neutral-950/40 rounded-b-xl border-t border-neutral-800/40 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="truncate max-w-[190px] italic">
          {match.liveNotes ? match.liveNotes : `Best of ${match.bestOf} series`}
        </div>
        <div className="flex items-center gap-1 text-neutral-400 group-hover:text-rose-400 transition-colors font-medium">
          <span>{isAdminMode ? 'Score' : 'Details'}</span>
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

interface ParticipantRowProps {
  participant: MatchParticipant;
  isWinner: boolean;
  isLoser: boolean;
  isLive: boolean;
  onSelectTag: (e: React.MouseEvent) => void;
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({
  participant,
  isWinner,
  isLoser,
  isLive,
  onSelectTag
}) => {
  const isTBD = participant.gamerTag.startsWith('TBD');

  return (
    <div
      className={`flex items-center justify-between p-1.5 rounded-lg transition-colors ${
        isWinner
          ? 'bg-rose-950/20 text-white font-semibold'
          : isLoser
          ? 'opacity-60 text-neutral-400'
          : 'text-neutral-200'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Seed Badge / Avatar */}
        {participant.avatar ? (
          <div className="h-7 w-7 rounded-md overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
            <img
              src={participant.avatar}
              alt={participant.gamerTag}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-7 w-7 rounded-md bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-400 shrink-0">
            {participant.seed ? `#${participant.seed}` : '-'}
          </div>
        )}

        {/* Tag and Country */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSelectTag}
              disabled={isTBD}
              className={`text-xs truncate font-medium text-left hover:underline focus:outline-none ${
                isWinner ? 'text-rose-400 font-bold' : isTBD ? 'text-neutral-500 italic' : 'text-neutral-200'
              }`}
            >
              {participant.gamerTag}
            </button>
            {participant.teamTag && (
              <span className="text-[10px] font-mono text-neutral-400">
                [{participant.teamTag}]
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score Box */}
      <div
        className={`h-7 w-7 rounded flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
          isWinner
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            : isLive
            ? 'bg-neutral-800 border-neutral-700 text-white'
            : 'bg-neutral-800/60 border-neutral-800 text-neutral-300'
        }`}
      >
        {isTBD ? '-' : participant.score}
      </div>
    </div>
  );
};
