import { PlayerProfile, Tournament, ActivityFeedItem } from './types';

export const INITIAL_PLAYERS: PlayerProfile[] = [
  {
    id: 'p-1',
    gamerTag: 'Valkyrie',
    realName: 'Min-jun Kim',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
    country: { code: 'KR', name: 'South Korea' },
    mainGame: 'Valorant',
    rankTier: 'Radiant #14',
    team: { name: 'Seoul Dynasty Ops', tag: 'SDO' },
    bio: 'Duelist / Jett specialist. Reigning regional MVP with a 1.48 KD ratio.',
    socialDiscord: 'ValkyrieKR#0001',
    socialSteamOrRiot: 'Valkyrie#SEOUL',
    winLoss: { wins: 48, losses: 12, winRate: 80.0 },
    tournamentStats: { tournamentsPlayed: 14, championships: 4, runnerUp: 2, totalPrizeWon: 34500 },
    matchHistory: [
      { id: 'h-1', opponentTag: 'Frost', score: '2 - 0', result: 'W', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' },
      { id: 'h-2', opponentTag: 'Aero', score: '2 - 1', result: 'W', date: '2026-08-20', tournamentName: 'Asia-Pacific Cup' },
      { id: 'h-3', opponentTag: 'Nova', score: '1 - 2', result: 'L', date: '2026-07-15', tournamentName: 'Global Gauntlet' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'p-2',
    gamerTag: 'Frost',
    realName: 'Jordan Miller',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
    country: { code: 'US', name: 'United States' },
    mainGame: 'Valorant',
    rankTier: 'Immortal 3',
    team: { name: 'CloudNine Vipers', tag: 'C9V' },
    bio: 'Initiator main, known for surgical Sova darts and mid-round tactical calls.',
    socialDiscord: 'FrostyJ#2026',
    socialSteamOrRiot: 'Frost#NA1',
    winLoss: { wins: 32, losses: 18, winRate: 64.0 },
    tournamentStats: { tournamentsPlayed: 11, championships: 1, runnerUp: 3, totalPrizeWon: 12000 },
    matchHistory: [
      { id: 'h-4', opponentTag: 'Valkyrie', score: '0 - 2', result: 'L', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' },
      { id: 'h-5', opponentTag: 'Titan', score: '2 - 1', result: 'W', date: '2026-08-11', tournamentName: 'NA Challenger Open' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-01T11:15:00Z'
  },
  {
    id: 'p-3',
    gamerTag: 'ViperX',
    realName: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
    country: { code: 'BR', name: 'Brazil' },
    mainGame: 'Valorant',
    rankTier: 'Radiant #32',
    team: { name: 'Fury eSports', tag: 'FRY' },
    bio: 'Aggressive smoke player with unmatched site retake efficiency. Top fragger in SA regional qualifiers.',
    socialDiscord: 'LucasViper#9999',
    socialSteamOrRiot: 'ViperX#BR1',
    winLoss: { wins: 41, losses: 15, winRate: 73.2 },
    tournamentStats: { tournamentsPlayed: 13, championships: 2, runnerUp: 4, totalPrizeWon: 22000 },
    matchHistory: [
      { id: 'h-6', opponentTag: 'Kage', score: '2 - 1', result: 'W', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'p-4',
    gamerTag: 'Kage',
    realName: 'Hiroshi Tanaka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    country: { code: 'JP', name: 'Japan' },
    mainGame: 'Valorant',
    rankTier: 'Immortal 3',
    team: { name: 'ZETA Nova', tag: 'ZN' },
    bio: 'Sentinel anchor specializing in Cypher camera setups and delay tactics.',
    socialDiscord: 'KageNinja#1104',
    socialSteamOrRiot: 'Kage#JP1',
    winLoss: { wins: 29, losses: 17, winRate: 63.0 },
    tournamentStats: { tournamentsPlayed: 9, championships: 1, runnerUp: 1, totalPrizeWon: 8500 },
    matchHistory: [
      { id: 'h-7', opponentTag: 'ViperX', score: '1 - 2', result: 'L', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-02T08:00:00Z'
  },
  {
    id: 'p-5',
    gamerTag: 'Titan',
    realName: 'Marcus Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    country: { code: 'SE', name: 'Sweden' },
    mainGame: 'Valorant',
    rankTier: 'Radiant #08',
    team: { name: 'Nordic Force', tag: 'NF' },
    bio: 'Precision sniper with the highest first-blood percentage in EU Masters.',
    socialDiscord: 'TitanMarcus#7777',
    socialSteamOrRiot: 'Titan#EUW',
    winLoss: { wins: 52, losses: 14, winRate: 78.8 },
    tournamentStats: { tournamentsPlayed: 16, championships: 5, runnerUp: 3, totalPrizeWon: 41200 },
    matchHistory: [
      { id: 'h-8', opponentTag: 'Aero', score: '2 - 0', result: 'W', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-02T09:30:00Z'
  },
  {
    id: 'p-6',
    gamerTag: 'Aero',
    realName: 'Alexander Bauer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
    country: { code: 'DE', name: 'Germany' },
    mainGame: 'Valorant',
    rankTier: 'Immortal 2',
    team: { name: 'Berlin Vanguard', tag: 'BVG' },
    bio: 'Flash and disrupt specialist, renowned for pinpoint flash timing.',
    socialDiscord: 'AeroAlex#4401',
    socialSteamOrRiot: 'Aero#GER',
    winLoss: { wins: 26, losses: 20, winRate: 56.5 },
    tournamentStats: { tournamentsPlayed: 8, championships: 0, runnerUp: 2, totalPrizeWon: 5200 },
    matchHistory: [
      { id: 'h-9', opponentTag: 'Titan', score: '0 - 2', result: 'L', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-02T14:10:00Z'
  },
  {
    id: 'p-7',
    gamerTag: 'Nova',
    realName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    country: { code: 'CA', name: 'Canada' },
    mainGame: 'Valorant',
    rankTier: 'Radiant #19',
    team: { name: 'Aurora Apex', tag: 'AA' },
    bio: 'Clutch queen with 28 1v3+ clutches recorded this season. Controller/Anchor hybrid.',
    socialDiscord: 'NovaElena#8080',
    socialSteamOrRiot: 'Nova#CA1',
    winLoss: { wins: 45, losses: 16, winRate: 73.7 },
    tournamentStats: { tournamentsPlayed: 12, championships: 3, runnerUp: 2, totalPrizeWon: 28900 },
    matchHistory: [
      { id: 'h-10', opponentTag: 'Blaze', score: '2 - 1', result: 'W', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-02T16:45:00Z'
  },
  {
    id: 'p-8',
    gamerTag: 'Blaze',
    realName: 'Liam Wright',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
    country: { code: 'GB', name: 'United Kingdom' },
    mainGame: 'Valorant',
    rankTier: 'Immortal 3',
    team: { name: 'London Knights', tag: 'LDK' },
    bio: 'Fast paced flex player capable of playing any role on short notice.',
    socialDiscord: 'BlazeUK#1234',
    socialSteamOrRiot: 'Blaze#EUW',
    winLoss: { wins: 33, losses: 19, winRate: 63.4 },
    tournamentStats: { tournamentsPlayed: 10, championships: 1, runnerUp: 2, totalPrizeWon: 9800 },
    matchHistory: [
      { id: 'h-11', opponentTag: 'Nova', score: '1 - 2', result: 'L', date: '2026-09-08', tournamentName: 'Valorant Tactical Masters' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-03T09:00:00Z'
  },
  // Street Fighter 6 Players
  {
    id: 'p-9',
    gamerTag: 'ShadowKick',
    realName: 'Daiki Takahashi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    country: { code: 'JP', name: 'Japan' },
    mainGame: 'Street Fighter 6',
    rankTier: 'Legend #03',
    team: { name: 'Kyoto Dragons', tag: 'KTD' },
    bio: 'Ken & Luke master. Unbeatable corner pressure and optimal whiff punishes.',
    socialDiscord: 'ShadowDaiki#9901',
    socialSteamOrRiot: 'ShadowKick_FGC',
    winLoss: { wins: 76, losses: 14, winRate: 84.4 },
    tournamentStats: { tournamentsPlayed: 22, championships: 9, runnerUp: 4, totalPrizeWon: 62000 },
    matchHistory: [
      { id: 'h-12', opponentTag: 'Vixen', score: '3 - 2', result: 'W', date: '2026-09-07', tournamentName: 'EVO Regional' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'p-10',
    gamerTag: 'CrimsonVixen',
    realName: 'Mia Zhang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    country: { code: 'SG', name: 'Singapore' },
    mainGame: 'Street Fighter 6',
    rankTier: 'Legend #11',
    team: { name: 'Pacific Apex', tag: 'PAX' },
    bio: 'Juri / Cammy specialist with frame-perfect drive rush extensions.',
    socialDiscord: 'MiaVixen#7712',
    socialSteamOrRiot: 'CrimsonVixen_SG',
    winLoss: { wins: 64, losses: 21, winRate: 75.3 },
    tournamentStats: { tournamentsPlayed: 18, championships: 6, runnerUp: 5, totalPrizeWon: 45000 },
    matchHistory: [
      { id: 'h-13', opponentTag: 'IronFist', score: '3 - 1', result: 'W', date: '2026-09-08', tournamentName: 'SF6 Apex Clash' }
    ],
    isCheckedIn: true,
    registeredAt: '2026-09-01T09:30:00Z'
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney-1',
    title: 'Valorant Tactical Masters 2026',
    game: 'Valorant',
    gameCategory: 'FPS',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    gameIcon: 'Crosshair',
    description: 'Premier single-elimination invitation tournament. 8 international elite contenders battling for the $25,000 championship purse.',
    status: 'live',
    prizePool: '$25,000 USD',
    format: 'Single Elimination',
    maxParticipants: 8,
    registeredCount: 8,
    startDate: '2026-09-09',
    location: 'LAN Arena Seoul / Global Stream',
    currentRound: 'Semifinals',
    participants: INITIAL_PLAYERS.slice(0, 8),
    matches: [
      // Quarterfinals (Round 1)
      {
        id: 'm-1',
        tournamentId: 'tourney-1',
        round: 1,
        roundName: 'Quarterfinals',
        matchNumber: 1,
        nextMatchId: 'm-5',
        nextMatchSlot: 1,
        participant1: {
          playerId: 'p-1',
          gamerTag: 'Valkyrie',
          avatar: INITIAL_PLAYERS[0].avatar,
          seed: 1,
          score: 2,
          isWinner: true,
          teamTag: 'SDO',
          countryCode: 'KR'
        },
        participant2: {
          playerId: 'p-2',
          gamerTag: 'Frost',
          avatar: INITIAL_PLAYERS[1].avatar,
          seed: 8,
          score: 0,
          isWinner: false,
          teamTag: 'C9V',
          countryCode: 'US'
        },
        status: 'completed',
        winnerId: 'p-1',
        winnerTag: 'Valkyrie',
        scheduledTime: '13:00 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Ascent / Bind',
        bestOf: 3,
        setScores: [[13, 7], [13, 9]],
        liveNotes: 'Valkyrie dominated Ascent with 24 kills on Jett.',
        updatedAt: '2026-09-09T04:30:00Z'
      },
      {
        id: 'm-2',
        tournamentId: 'tourney-1',
        round: 1,
        roundName: 'Quarterfinals',
        matchNumber: 2,
        nextMatchId: 'm-5',
        nextMatchSlot: 2,
        participant1: {
          playerId: 'p-3',
          gamerTag: 'ViperX',
          avatar: INITIAL_PLAYERS[2].avatar,
          seed: 4,
          score: 2,
          isWinner: true,
          teamTag: 'FRY',
          countryCode: 'BR'
        },
        participant2: {
          playerId: 'p-4',
          gamerTag: 'Kage',
          avatar: INITIAL_PLAYERS[3].avatar,
          seed: 5,
          score: 1,
          isWinner: false,
          teamTag: 'ZN',
          countryCode: 'JP'
        },
        status: 'completed',
        winnerId: 'p-3',
        winnerTag: 'ViperX',
        scheduledTime: '14:30 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Lotus / Sunset / Haven',
        bestOf: 3,
        setScores: [[13, 11], [9, 13], [14, 12]],
        liveNotes: 'OT thriller on Haven decided by ViperX 1v2 clutch!',
        updatedAt: '2026-09-09T06:00:00Z'
      },
      {
        id: 'm-3',
        tournamentId: 'tourney-1',
        round: 1,
        roundName: 'Quarterfinals',
        matchNumber: 3,
        nextMatchId: 'm-6',
        nextMatchSlot: 1,
        participant1: {
          playerId: 'p-5',
          gamerTag: 'Titan',
          avatar: INITIAL_PLAYERS[4].avatar,
          seed: 2,
          score: 2,
          isWinner: true,
          teamTag: 'NF',
          countryCode: 'SE'
        },
        participant2: {
          playerId: 'p-6',
          gamerTag: 'Aero',
          avatar: INITIAL_PLAYERS[5].avatar,
          seed: 7,
          score: 0,
          isWinner: false,
          teamTag: 'BVG',
          countryCode: 'DE'
        },
        status: 'completed',
        winnerId: 'p-5',
        winnerTag: 'Titan',
        scheduledTime: '16:00 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Icebox / Split',
        bestOf: 3,
        setScores: [[13, 8], [13, 6]],
        liveNotes: 'Titan Operator showcase went 18-3 on Icebox.',
        updatedAt: '2026-09-09T07:15:00Z'
      },
      {
        id: 'm-4',
        tournamentId: 'tourney-1',
        round: 1,
        roundName: 'Quarterfinals',
        matchNumber: 4,
        nextMatchId: 'm-6',
        nextMatchSlot: 2,
        participant1: {
          playerId: 'p-7',
          gamerTag: 'Nova',
          avatar: INITIAL_PLAYERS[6].avatar,
          seed: 3,
          score: 2,
          isWinner: true,
          teamTag: 'AA',
          countryCode: 'CA'
        },
        participant2: {
          playerId: 'p-8',
          gamerTag: 'Blaze',
          avatar: INITIAL_PLAYERS[7].avatar,
          seed: 6,
          score: 1,
          isWinner: false,
          teamTag: 'LDK',
          countryCode: 'GB'
        },
        status: 'completed',
        winnerId: 'p-7',
        winnerTag: 'Nova',
        scheduledTime: '17:30 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Abyss / Sunset / Fracture',
        bestOf: 3,
        setScores: [[13, 10], [11, 13], [13, 8]],
        liveNotes: 'Nova secured victory in map 3 with flawless post-plants.',
        updatedAt: '2026-09-09T08:45:00Z'
      },

      // Semifinals (Round 2)
      {
        id: 'm-5',
        tournamentId: 'tourney-1',
        round: 2,
        roundName: 'Semifinals',
        matchNumber: 1,
        nextMatchId: 'm-7',
        nextMatchSlot: 1,
        participant1: {
          playerId: 'p-1',
          gamerTag: 'Valkyrie',
          avatar: INITIAL_PLAYERS[0].avatar,
          seed: 1,
          score: 1,
          isWinner: false,
          teamTag: 'SDO',
          countryCode: 'KR'
        },
        participant2: {
          playerId: 'p-3',
          gamerTag: 'ViperX',
          avatar: INITIAL_PLAYERS[2].avatar,
          seed: 4,
          score: 1,
          isWinner: false,
          teamTag: 'FRY',
          countryCode: 'BR'
        },
        status: 'live',
        scheduledTime: '19:00 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Haven (Map 3 - Decider)',
        bestOf: 3,
        setScores: [[13, 8], [9, 13]],
        liveNotes: 'TIED 1-1! Map 3 Haven in progress: round score is 9-9!',
        updatedAt: '2026-09-09T10:15:00Z'
      },
      {
        id: 'm-6',
        tournamentId: 'tourney-1',
        round: 2,
        roundName: 'Semifinals',
        matchNumber: 2,
        nextMatchId: 'm-7',
        nextMatchSlot: 2,
        participant1: {
          playerId: 'p-5',
          gamerTag: 'Titan',
          avatar: INITIAL_PLAYERS[4].avatar,
          seed: 2,
          score: 0,
          teamTag: 'NF',
          countryCode: 'SE'
        },
        participant2: {
          playerId: 'p-7',
          gamerTag: 'Nova',
          avatar: INITIAL_PLAYERS[6].avatar,
          seed: 3,
          score: 0,
          teamTag: 'AA',
          countryCode: 'CA'
        },
        status: 'scheduled',
        scheduledTime: '20:30 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Pick & Ban pending',
        bestOf: 3,
        liveNotes: 'Players in warm-up lobby.',
        updatedAt: '2026-09-09T09:00:00Z'
      },

      // Grand Final (Round 3)
      {
        id: 'm-7',
        tournamentId: 'tourney-1',
        round: 3,
        roundName: 'Grand Final',
        matchNumber: 1,
        participant1: {
          gamerTag: 'TBD (Winner SF1)',
          score: 0
        },
        participant2: {
          gamerTag: 'TBD (Winner SF2)',
          score: 0
        },
        status: 'scheduled',
        scheduledTime: '22:00 KST',
        streamUrl: 'https://twitch.tv/tacticalmasters',
        gameMap: 'Best of 5 Championship Series',
        bestOf: 5,
        liveNotes: 'Trophy ceremony and $15,000 first prize on the line.',
        updatedAt: '2026-09-09T09:00:00Z'
      }
    ]
  },
  {
    id: 'tourney-2',
    title: 'Street Fighter 6 Apex Clash',
    game: 'Street Fighter 6',
    gameCategory: 'Fighting',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    gameIcon: 'Swords',
    description: 'High-octane double-bracket fighting championship. Best players from Japan, USA, and Southeast Asia.',
    status: 'live',
    prizePool: '$18,000 USD',
    format: 'Single Elimination',
    maxParticipants: 4,
    registeredCount: 4,
    startDate: '2026-09-09',
    location: 'Akihabara eSports Square / Tokyo',
    currentRound: 'Grand Final',
    participants: [INITIAL_PLAYERS[8], INITIAL_PLAYERS[9]],
    matches: [
      {
        id: 'm-sf-1',
        tournamentId: 'tourney-2',
        round: 1,
        roundName: 'Semifinals',
        matchNumber: 1,
        nextMatchId: 'm-sf-3',
        nextMatchSlot: 1,
        participant1: {
          playerId: 'p-9',
          gamerTag: 'ShadowKick',
          avatar: INITIAL_PLAYERS[8].avatar,
          score: 3,
          isWinner: true,
          teamTag: 'KTD',
          countryCode: 'JP'
        },
        participant2: {
          gamerTag: 'SonicHurricane',
          score: 1,
          isWinner: false,
          teamTag: 'RCG',
          countryCode: 'US'
        },
        status: 'completed',
        winnerId: 'p-9',
        winnerTag: 'ShadowKick',
        scheduledTime: '18:00 JST',
        bestOf: 5,
        updatedAt: '2026-09-09T09:30:00Z'
      },
      {
        id: 'm-sf-2',
        tournamentId: 'tourney-2',
        round: 1,
        roundName: 'Semifinals',
        matchNumber: 2,
        nextMatchId: 'm-sf-3',
        nextMatchSlot: 2,
        participant1: {
          playerId: 'p-10',
          gamerTag: 'CrimsonVixen',
          avatar: INITIAL_PLAYERS[9].avatar,
          score: 3,
          isWinner: true,
          teamTag: 'PAX',
          countryCode: 'SG'
        },
        participant2: {
          gamerTag: 'DragonClaw',
          score: 2,
          isWinner: false,
          teamTag: 'EVO',
          countryCode: 'KR'
        },
        status: 'completed',
        winnerId: 'p-10',
        winnerTag: 'CrimsonVixen',
        scheduledTime: '19:00 JST',
        bestOf: 5,
        updatedAt: '2026-09-09T10:00:00Z'
      },
      {
        id: 'm-sf-3',
        tournamentId: 'tourney-2',
        round: 2,
        roundName: 'Grand Final',
        matchNumber: 1,
        participant1: {
          playerId: 'p-9',
          gamerTag: 'ShadowKick',
          avatar: INITIAL_PLAYERS[8].avatar,
          score: 2,
          isWinner: false,
          teamTag: 'KTD',
          countryCode: 'JP'
        },
        participant2: {
          playerId: 'p-10',
          gamerTag: 'CrimsonVixen',
          avatar: INITIAL_PLAYERS[9].avatar,
          score: 2,
          isWinner: false,
          teamTag: 'PAX',
          countryCode: 'SG'
        },
        status: 'live',
        scheduledTime: '20:00 JST',
        streamUrl: 'https://twitch.tv/sf6apex',
        bestOf: 5,
        liveNotes: 'MATCH POINT! Game 5 Final Round! Ken vs Juri!',
        updatedAt: '2026-09-09T11:00:00Z'
      }
    ]
  },
  {
    id: 'tourney-3',
    title: 'Apex Legends Duo Open 2026',
    game: 'Apex Legends',
    gameCategory: 'Battle Royale',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    gameIcon: 'Trophy',
    description: 'Open registration duo battle royale qualifier. Top 16 duos qualify for the ALGS Challenger Circuit.',
    status: 'registration_open',
    prizePool: '$10,000 USD',
    format: 'Single Elimination',
    maxParticipants: 16,
    registeredCount: 6,
    startDate: '2026-09-18',
    location: 'Online NA & EU Servers',
    currentRound: 'Registration Open',
    participants: INITIAL_PLAYERS.slice(0, 6),
    matches: []
  },
  {
    id: 'tourney-4',
    title: 'Rocket League Championship Cup',
    game: 'Rocket League',
    gameCategory: 'Sports',
    bannerUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80',
    gameIcon: 'Zap',
    description: '3v3 aerial mastery tournament. Standard competitive maps with overtime sudden death rules.',
    status: 'upcoming',
    prizePool: '$15,000 USD',
    format: 'Single Elimination',
    maxParticipants: 8,
    registeredCount: 4,
    startDate: '2026-09-25',
    location: 'London Copper Box Arena',
    currentRound: 'Brackets seeding soon',
    participants: INITIAL_PLAYERS.slice(2, 6),
    matches: []
  }
];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    tournamentId: 'tourney-1',
    tournamentTitle: 'Valorant Tactical Masters 2026',
    type: 'match_live',
    message: 'Semifinals 1: Valkyrie vs ViperX is now LIVE on Map 3 Haven!',
    details: 'Game is currently tied 1-1 in maps. Winner advances to Grand Final.',
    timestamp: '5 mins ago'
  },
  {
    id: 'act-2',
    tournamentId: 'tourney-1',
    tournamentTitle: 'Valorant Tactical Masters 2026',
    type: 'match_score',
    message: 'Score update: Map 3 Haven score tied at 9 - 9!',
    details: 'Valkyrie secured a 3k clutch with Blade Storm.',
    timestamp: '8 mins ago'
  },
  {
    id: 'act-3',
    tournamentId: 'tourney-2',
    tournamentTitle: 'Street Fighter 6 Apex Clash',
    type: 'match_live',
    message: 'Grand Final: ShadowKick vs CrimsonVixen tied 2-2 in sets!',
    details: 'Final round deciding the $18,000 championship.',
    timestamp: '14 mins ago'
  },
  {
    id: 'act-4',
    tournamentId: 'tourney-1',
    tournamentTitle: 'Valorant Tactical Masters 2026',
    type: 'match_complete',
    message: 'Nova defeated Blaze (2-1) in Quarterfinals Match 4',
    details: 'Nova moves forward to face Titan in Semifinals 2.',
    timestamp: '32 mins ago'
  },
  {
    id: 'act-5',
    tournamentId: 'tourney-3',
    tournamentTitle: 'Apex Legends Duo Open 2026',
    type: 'player_registered',
    message: 'Frost (CloudNine Vipers) registered for the tournament',
    details: 'Registration slot 6 of 16 filled.',
    timestamp: '1 hour ago'
  }
];
