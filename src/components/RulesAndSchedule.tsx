import React from 'react';
import { ShieldCheck, Trophy, Clock, AlertTriangle, Calendar, Award, Check } from 'lucide-react';
import { Tournament } from '../types';

interface RulesAndScheduleProps {
  tournament: Tournament;
}

export const RulesAndSchedule: React.FC<RulesAndScheduleProps> = ({ tournament }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Prize Breakdown & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Trophy className="h-4 w-4" /> 1st Place Champion
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              60% of Prize Pool
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Championship Trophy + Direct Qualification to Global Championship Finals.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-semibold text-neutral-300">
            Prize Distribution
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" /> 2nd Place Runner-Up
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              25% of Prize Pool
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Runner-up medal + 400 Circuit Points.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-semibold text-neutral-300">
            Grand Finalists
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" /> 3rd & 4th Place
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-2">
              15% Split (7.5% each)
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Semifinalists purse + 200 Circuit Points.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-semibold text-neutral-300">
            Semifinalists
          </div>
        </div>
      </div>

      {/* Official Rulebook */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-rose-500" />
          <span>Official Competition Rulebook & Regulations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-300">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                1. Check-In & Lobby Attendance
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                All registered participants must complete in-client check-in at least 30 minutes prior to scheduled match time. Failure to check-in or join within 10 minutes of referee call results in an automatic match forfeit.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                2. Match Format & Decider Maps
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Matches are played as Best of 3 (Bo3), with Grand Finals contested as Best of 5 (Bo5). Coin toss decides Map Ban & Pick priority. All games utilize standard competitive tournament server settings.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                3. Disconnections & Pauses
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Each participant is allowed a maximum of 5 minutes tactical technical pause per match. If a player cannot reconnect, the referee reserves the right to reschedule or award the game to the opposing participant.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                4. Real-Time Score Reporting
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Designated referees and scorekeepers submit end-of-map screenshots to the tournament portal. Scores are synchronized immediately to the live bracket engine.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                5. Fair Play & Anti-Cheat
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Third-party scripts, exploits, smurfing, and unsportsmanlike behavior will result in immediate disqualification and a 1-year suspension across all GameArena tournament circuits.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                6. Streaming & Delay Rules
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Point-of-view streams by players must mandate a minimum 120-second broadcast delay to prevent stream sniping and ensure integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
