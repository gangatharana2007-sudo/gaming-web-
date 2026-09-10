import React, { useState } from 'react';
import { X, UserPlus, Shield, Sparkles, Check, Globe, Gamepad2 } from 'lucide-react';
import { PlayerProfile, Tournament } from '../types';

interface RegistrationModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (playerData: Partial<PlayerProfile>) => Promise<void>;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'SE', name: 'Sweden' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AU', name: 'Australia' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80'
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onRegister
}) => {
  const [gamerTag, setGamerTag] = useState('');
  const [realName, setRealName] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [rankTier, setRankTier] = useState('Immortal 1');
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [bio, setBio] = useState('');
  const [socialDiscord, setSocialDiscord] = useState('');
  const [socialSteamOrRiot, setSocialSteamOrRiot] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamerTag.trim()) {
      setError('Please enter your gamer tag (IGN).');
      return;
    }
    if (!realName.trim()) {
      setError('Please enter your real name for official roster records.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const selectedCountry = COUNTRIES.find((c) => c.code === countryCode) || {
        code: 'US',
        name: 'United States'
      };

      await onRegister({
        gamerTag: gamerTag.trim(),
        realName: realName.trim(),
        avatar,
        country: selectedCountry,
        mainGame: tournament.game,
        rankTier: rankTier.trim() || 'Diamond 1',
        team: teamName.trim()
          ? {
              name: teamName.trim(),
              tag: teamTag.trim() || teamName.substring(0, 3).toUpperCase()
            }
          : undefined,
        bio: bio.trim() || `Competitor registered for ${tournament.title}`,
        socialDiscord: socialDiscord.trim(),
        socialSteamOrRiot: socialSteamOrRiot.trim(),
        isCheckedIn: true
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                Player Registration
              </span>
              <span className="text-xs text-neutral-400">
                {tournament.title}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Tournament Entry & Competitor Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Select Competitor Avatar:
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`h-14 w-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    avatar === url
                      ? 'border-rose-500 ring-2 ring-rose-500/40 scale-105'
                      : 'border-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Gamer Tag & Real Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Gamer Tag / In-Game Name (IGN) *
              </label>
              <input
                type="text"
                required
                value={gamerTag}
                onChange={(e) => setGamerTag(e.target.value)}
                placeholder="e.g. Phantom, ApexPro, Vortex"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Real Name (Official Verification) *
              </label>
              <input
                type="text"
                required
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="e.g. Liam Vance"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Country & Current Rank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Country / Region Flag
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Competitive Rank / Division
              </label>
              <input
                type="text"
                value={rankTier}
                onChange={(e) => setRankTier(e.target.value)}
                placeholder="e.g. Radiant, Master, Legend #12"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Team Affiliation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Team / Org Name (Optional)
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Sentinels, CloudNine"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Team Tag (3-4 Chars)
              </label>
              <input
                type="text"
                maxLength={5}
                value={teamTag}
                onChange={(e) => setTeamTag(e.target.value.toUpperCase())}
                placeholder="e.g. SEN, C9"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white font-mono uppercase focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* In-game & Discord IDs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Discord Tag (For Referee Match Calls)
              </label>
              <input
                type="text"
                value={socialDiscord}
                onChange={(e) => setSocialDiscord(e.target.value)}
                placeholder="e.g. player#1234"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                In-Game / Steam / Riot ID
              </label>
              <input
                type="text"
                value={socialSteamOrRiot}
                onChange={(e) => setSocialSteamOrRiot(e.target.value)}
                placeholder="e.g. GamerTag#NA1"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Bio / Playstyle */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Player Bio & Playstyle Notes
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Duelist main, specialized in entry fragging and high-risk clutches."
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {/* Instant Card Preview */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Live Profile Preview:
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                <img src={avatar} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    {gamerTag || 'PlayerTag'}
                  </span>
                  {teamTag && (
                    <span className="text-xs font-mono text-rose-400">[{teamTag}]</span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono">
                    {countryCode}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 truncate">
                  {rankTier} • {tournament.game}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-600/30 disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
