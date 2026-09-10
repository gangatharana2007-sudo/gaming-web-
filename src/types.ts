export interface PlayerProfile {
  id: string;
  gamerTag: string;
  realName: string;
  avatar: string;
  country: {
    code: string;
    name: string;
  };
  mainGame: string;
  rankTier: string;
  team?: {
    name: string;
    tag: string;
    logo?: string;
  };
  bio: string;
  socialDiscord?: string;
  socialSteamOrRiot?: string;
  winLoss: {
    wins: number;
    losses: number;
    winRate: number; // percentage e.g. 72.5
  };
  tournamentStats: {
    tournamentsPlayed: number;
    championships: number;
    runnerUp: number;
    totalPrizeWon: number; // e.g. 14500 ($)
  };
  matchHistory: Array<{
    id: string;
    opponentTag: string;
    score: string;
    result: 'W' | 'L';
    date: string;
    tournamentName: string;
  }>;
  isCheckedIn: boolean;
  registeredAt: string;
}

export interface MatchParticipant {
  playerId?: string;
  gamerTag: string;
  avatar?: string;
  seed?: number;
  score: number;
  isWinner?: boolean;
  teamTag?: string;
  countryCode?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number; // 1 = Quarterfinals, 2 = Semifinals, 3 = Grand Finals
  roundName: string; // e.g., "Quarterfinals", "Semifinals", "Grand Final"
  matchNumber: number;
  nextMatchId?: string;
  nextMatchSlot?: 1 | 2;
  participant1: MatchParticipant;
  participant2: MatchParticipant;
  status: 'scheduled' | 'live' | 'completed';
  winnerId?: string;
  winnerTag?: string;
  scheduledTime: string;
  streamUrl?: string;
  gameMap?: string;
  bestOf: number; // e.g. 3, 5
  setScores?: number[][]; // e.g. [[13, 11], [9, 13], [13, 10]]
  liveNotes?: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  gameCategory: 'FPS' | 'Fighting' | 'Battle Royale' | 'MOBA' | 'Sports';
  bannerUrl: string;
  gameIcon: string;
  description: string;
  status: 'upcoming' | 'registration_open' | 'live' | 'completed';
  prizePool: string;
  format: 'Single Elimination' | 'Double Elimination';
  maxParticipants: number;
  registeredCount: number;
  startDate: string;
  location: string;
  currentRound: string;
  matches: Match[];
  participants: PlayerProfile[];
  champion?: MatchParticipant;
}

export interface ActivityFeedItem {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  type: 'match_score' | 'match_live' | 'match_complete' | 'player_registered' | 'tournament_champion';
  message: string;
  details?: string;
  timestamp: string;
}

export interface TournamentState {
  tournaments: Tournament[];
  activeTournamentId: string;
  spectatorCount: number;
  activityFeed: ActivityFeedItem[];
  allPlayers: PlayerProfile[];
}

// WebSocket client-to-server and server-to-client payloads
export type WSMessage =
  | { type: 'INIT_STATE'; payload: TournamentState }
  | { type: 'MATCH_UPDATE'; payload: { tournamentId: string; match: Match; activity: ActivityFeedItem } }
  | { type: 'REGISTER_PLAYER'; payload: { tournamentId: string; player: PlayerProfile; activity: ActivityFeedItem } }
  | { type: 'TOGGLE_CHECKIN'; payload: { tournamentId: string; playerId: string; isCheckedIn: boolean } }
  | { type: 'RESET_BRACKET'; payload: { tournamentId: string; matches: Match[]; activity: ActivityFeedItem } }
  | { type: 'SPECTATOR_COUNT'; payload: { count: number } }
  | { type: 'TOURNAMENT_CREATE'; payload: { tournament: Tournament; activity: ActivityFeedItem } };
