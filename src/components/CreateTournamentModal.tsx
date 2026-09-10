import React, { useState } from 'react';
import { X, Trophy, PlusCircle, Gamepad2 } from 'lucide-react';
import { Tournament } from '../types';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTournament: (tourneyData: Partial<Tournament>) => Promise<void>;
}

const GAME_PRESETS = [
  { name: 'Valorant', category: 'FPS', banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Street Fighter 6', category: 'Fighting', banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Counter-Strike 2', category: 'FPS', banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Apex Legends', category: 'Battle Royale', banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Rocket League', category: 'Sports', banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Super Smash Bros', category: 'Fighting', banner: 'https://images.unsplash.com/photo-1612287233207-63a2333cfc13?w=1200&auto=format&fit=crop&q=80' }
];

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreateTournament
}) => {
  const [title, setTitle] = useState('');
  const [selectedGame, setSelectedGame] = useState(GAME_PRESETS[0]);
  const [prizePool, setPrizePool] = useState('$5,000 USD');
  const [format, setFormat] = useState<'Single Elimination' | 'Double Elimination'>('Single Elimination');
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [location, setLocation] = useState('Online - Global Dedicated Servers');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateTournament({
        title: title.trim(),
        game: selectedGame.name,
        gameCategory: selectedGame.category as any,
        bannerUrl: selectedGame.banner,
        gameIcon: 'Trophy',
        description: description.trim() || `Official competitive ${selectedGame.name} tournament.`,
        status: 'registration_open',
        prizePool: prizePool.trim(),
        format,
        maxParticipants,
        startDate: new Date().toISOString().split('T')[0],
        location: location.trim(),
        currentRound: 'Registration Open',
        participants: [],
        matches: []
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div>
            <span className="text-xs font-mono font-semibold uppercase text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
              Organizer Panel
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Host a New Games Tournament</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Tournament Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Winter Clash Invitational 2026"
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Game Title
              </label>
              <select
                value={selectedGame.name}
                onChange={(e) => {
                  const preset = GAME_PRESETS.find((g) => g.name === e.target.value);
                  if (preset) setSelectedGame(preset);
                }}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                {GAME_PRESETS.map((g) => (
                  <option key={g.name} value={g.name}>
                    {g.name} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Prize Pool Purse
              </label>
              <input
                type="text"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="e.g. $10,000 USD"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Bracket Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Single Elimination">Single Elimination</option>
                <option value="Double Elimination">Double Elimination</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Max Participant Slots
              </label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value={4}>4 Players (Semifinals + Final)</option>
                <option value={8}>8 Players (Quarterfinals + Semis + Final)</option>
                <option value={16}>16 Players (Round of 16 + Quarters + Semis + Final)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Venue / Region Server
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Online NA / EU, LAN Arena Chicago"
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Tournament Overview & Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide rules summary, eligibility, or stream details."
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-between">
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
              <PlusCircle className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Tournament'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
