import React from 'react';
import { Radio, Trophy, CheckCircle2, UserPlus, Flame, Bell, Sparkles } from 'lucide-react';
import { ActivityFeedItem } from '../types';

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  currentTournamentId: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  currentTournamentId
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <span>Live Tournament Activity & Dispatch Feed</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time authoritative match scores, player registrations, and tournament milestones.
          </p>
        </div>
        <div className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
          {items.length} Events Logged
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isThisTourney = item.tournamentId === currentTournamentId;

          let icon = <Bell className="h-4 w-4 text-neutral-400" />;
          let badgeColor = 'bg-neutral-800 text-neutral-300 border-neutral-700';

          if (item.type === 'match_live') {
            icon = <Radio className="h-4 w-4 text-rose-400 animate-pulse" />;
            badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          } else if (item.type === 'match_complete') {
            icon = <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
            badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          } else if (item.type === 'tournament_champion') {
            icon = <Trophy className="h-4 w-4 text-amber-400" />;
            badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          } else if (item.type === 'player_registered') {
            icon = <UserPlus className="h-4 w-4 text-blue-400" />;
            badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
          }

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isThisTourney
                  ? 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-900/50 border-neutral-800/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0 mt-0.5">
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium truncate">
                        {item.tournamentTitle}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mt-1.5 leading-snug">
                    {item.message}
                  </p>

                  {item.details && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
