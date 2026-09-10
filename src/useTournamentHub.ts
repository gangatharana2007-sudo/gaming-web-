import { useState, useEffect, useRef, useCallback } from 'react';
import { Tournament, Match, PlayerProfile, ActivityFeedItem, TournamentState, WSMessage } from './types';
import { INITIAL_TOURNAMENTS, INITIAL_PLAYERS, INITIAL_ACTIVITY_FEED } from './initialData';

export function useTournamentHub() {
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [activeTournamentId, setActiveTournamentId] = useState<string>(INITIAL_TOURNAMENTS[0].id);
  const [spectatorCount, setSpectatorCount] = useState<number>(12);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);
  const [allPlayers, setAllPlayers] = useState<PlayerProfile[]>(INITIAL_PLAYERS);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // Active tournament helper
  const activeTournament = tournaments.find((t) => t.id === activeTournamentId) || tournaments[0] || null;

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          switch (message.type) {
            case 'INIT_STATE': {
              const { tournaments, activeTournamentId, spectatorCount, activityFeed, allPlayers } = message.payload;
              if (tournaments && tournaments.length > 0) setTournaments(tournaments);
              if (activeTournamentId) setActiveTournamentId(activeTournamentId);
              if (spectatorCount !== undefined) setSpectatorCount(spectatorCount);
              if (activityFeed) setActivityFeed(activityFeed);
              if (allPlayers) setAllPlayers(allPlayers);
              break;
            }
            case 'MATCH_UPDATE': {
              const { tournamentId, match, activity } = message.payload;
              setTournaments((prev) =>
                prev.map((t) => {
                  if (t.id !== tournamentId) return t;
                  // Update match in tournament
                  const updatedMatches = t.matches.map((m) => (m.id === match.id ? match : m));

                  // If match is completed, check winner advancement in client state
                  let nextChampion = t.champion;
                  let nextStatus = t.status;

                  if (match.status === 'completed' && (match.winnerId || match.winnerTag)) {
                    const winningParticipant = match.participant1.isWinner
                      ? match.participant1
                      : match.participant2;

                    if (match.nextMatchId) {
                      const nextMatch = updatedMatches.find((m) => m.id === match.nextMatchId);
                      if (nextMatch) {
                        if (match.nextMatchSlot === 1) {
                          nextMatch.participant1 = { ...winningParticipant, score: 0, isWinner: false };
                        } else {
                          nextMatch.participant2 = { ...winningParticipant, score: 0, isWinner: false };
                        }
                      }
                    } else {
                      // Grand Final
                      nextChampion = winningParticipant;
                      nextStatus = 'completed';
                    }
                  }

                  return {
                    ...t,
                    matches: updatedMatches,
                    champion: nextChampion,
                    status: nextStatus
                  };
                })
              );

              if (activity) {
                setActivityFeed((prev) => [activity, ...prev.slice(0, 49)]);
              }
              break;
            }
            case 'REGISTER_PLAYER': {
              const { tournamentId, player, activity } = message.payload;
              setTournaments((prev) =>
                prev.map((t) => {
                  if (t.id !== tournamentId) return t;
                  const alreadyRegistered = t.participants.some((p) => p.id === player.id);
                  if (alreadyRegistered) return t;
                  return {
                    ...t,
                    participants: [...t.participants, player],
                    registeredCount: t.participants.length + 1
                  };
                })
              );
              setAllPlayers((prev) => {
                if (prev.some((p) => p.id === player.id)) return prev;
                return [...prev, player];
              });
              if (activity) {
                setActivityFeed((prev) => [activity, ...prev.slice(0, 49)]);
              }
              break;
            }
            case 'TOGGLE_CHECKIN': {
              const { tournamentId, playerId, isCheckedIn } = message.payload;
              setTournaments((prev) =>
                prev.map((t) => {
                  if (t.id !== tournamentId) return t;
                  return {
                    ...t,
                    participants: t.participants.map((p) =>
                      p.id === playerId ? { ...p, isCheckedIn } : p
                    )
                  };
                })
              );
              setAllPlayers((prev) =>
                prev.map((p) => (p.id === playerId ? { ...p, isCheckedIn } : p))
              );
              break;
            }
            case 'RESET_BRACKET': {
              const { tournamentId, matches, activity } = message.payload;
              setTournaments((prev) =>
                prev.map((t) => {
                  if (t.id !== tournamentId) return t;
                  return {
                    ...t,
                    matches,
                    champion: undefined,
                    status: 'live'
                  };
                })
              );
              if (activity) {
                setActivityFeed((prev) => [activity, ...prev.slice(0, 49)]);
              }
              break;
            }
            case 'SPECTATOR_COUNT': {
              setSpectatorCount(message.payload.count);
              break;
            }
            case 'TOURNAMENT_CREATE': {
              const { tournament, activity } = message.payload;
              setTournaments((prev) => [...prev, tournament]);
              setActiveTournamentId(tournament.id);
              if (activity) {
                setActivityFeed((prev) => [activity, ...prev.slice(0, 49)]);
              }
              break;
            }
          }
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Auto-reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.error('WebSocket connection error:', e);
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    }
  }, []);

  // Fetch initial state via REST as fallback
  useEffect(() => {
    fetch('/api/state')
      .then((res) => res.json())
      .then((data: TournamentState) => {
        if (data.tournaments && data.tournaments.length > 0) setTournaments(data.tournaments);
        if (data.activeTournamentId) setActiveTournamentId(data.activeTournamentId);
        if (data.spectatorCount) setSpectatorCount(data.spectatorCount);
        if (data.activityFeed) setActivityFeed(data.activityFeed);
        if (data.allPlayers) setAllPlayers(data.allPlayers);
      })
      .catch((err) => {
        console.log('REST fallback fetch (server starting up):', err);
      });

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket]);

  // Actions
  const updateMatch = async (updatedMatch: Match) => {
    if (!activeTournament) return;

    // Optimistic local update
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== activeTournament.id) return t;
        return {
          ...t,
          matches: t.matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))
        };
      })
    );

    // Send via REST and WS
    try {
      await fetch(`/api/tournaments/${activeTournament.id}/matches/${updatedMatch.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: activeTournament.id, match: updatedMatch })
      });
    } catch (err) {
      // WS fallback will propagate if available
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'MATCH_UPDATE',
          payload: { tournamentId: activeTournament.id, match: updatedMatch }
        })
      );
    }
  };

  const registerPlayer = async (playerData: Partial<PlayerProfile>) => {
    if (!activeTournament) return;

    try {
      const res = await fetch(`/api/tournaments/${activeTournament.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register player');
    } catch (err) {
      // Offline fallback: update local
      const newPlayer: PlayerProfile = {
        id: `p-${Date.now()}`,
        gamerTag: playerData.gamerTag || 'Player',
        realName: playerData.realName || 'Anonymous',
        avatar: playerData.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&auto=format&fit=crop&q=80',
        country: playerData.country || { code: 'US', name: 'United States' },
        mainGame: activeTournament.game,
        rankTier: playerData.rankTier || 'Diamond 1',
        team: playerData.team,
        bio: playerData.bio || '',
        socialDiscord: playerData.socialDiscord,
        socialSteamOrRiot: playerData.socialSteamOrRiot,
        winLoss: { wins: 0, losses: 0, winRate: 0 },
        tournamentStats: { tournamentsPlayed: 1, championships: 0, runnerUp: 0, totalPrizeWon: 0 },
        matchHistory: [],
        isCheckedIn: true,
        registeredAt: new Date().toISOString()
      };

      setTournaments((prev) =>
        prev.map((t) => {
          if (t.id !== activeTournament.id) return t;
          return {
            ...t,
            participants: [...t.participants, newPlayer],
            registeredCount: t.participants.length + 1
          };
        })
      );
    }
  };

  const toggleCheckIn = async (playerId: string, isCheckedIn: boolean) => {
    if (!activeTournament) return;

    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== activeTournament.id) return t;
        return {
          ...t,
          participants: t.participants.map((p) => (p.id === playerId ? { ...p, isCheckedIn } : p))
        };
      })
    );

    try {
      await fetch(`/api/tournaments/${activeTournament.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, isCheckedIn })
      });
    } catch (e) {
      // ignore
    }
  };

  const resetBracket = async () => {
    if (!activeTournament) return;

    try {
      await fetch(`/api/tournaments/${activeTournament.id}/reset`, {
        method: 'POST'
      });
    } catch (e) {
      // WS trigger
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'RESET_BRACKET',
            payload: { tournamentId: activeTournament.id }
          })
        );
      }
    }
  };

  const simulateNextMatch = async () => {
    if (!activeTournament) return;

    // Find the current live or next scheduled match
    const liveMatch = activeTournament.matches.find((m) => m.status === 'live');
    const matchToSimulate = liveMatch || activeTournament.matches.find((m) => m.status === 'scheduled' && !m.participant1.gamerTag.startsWith('TBD') && !m.participant2.gamerTag.startsWith('TBD'));

    if (!matchToSimulate) return;

    if (matchToSimulate.status === 'scheduled') {
      // Start match as live
      const updated: Match = {
        ...matchToSimulate,
        status: 'live',
        liveNotes: 'Match is now in progress on decider map!'
      };
      await updateMatch(updated);
    } else if (matchToSimulate.status === 'live') {
      // Advance to completion with random winner
      const p1Wins = Math.random() > 0.45;
      const p1Score = p1Wins ? Math.ceil(matchToSimulate.bestOf / 2) : Math.floor(matchToSimulate.bestOf / 2) - 1;
      const p2Score = p1Wins ? p1Score - 1 : Math.ceil(matchToSimulate.bestOf / 2);

      const updated: Match = {
        ...matchToSimulate,
        status: 'completed',
        participant1: {
          ...matchToSimulate.participant1,
          score: Math.max(0, p1Score),
          isWinner: p1Wins
        },
        participant2: {
          ...matchToSimulate.participant2,
          score: Math.max(0, p2Score),
          isWinner: !p1Wins
        },
        winnerId: p1Wins ? matchToSimulate.participant1.playerId : matchToSimulate.participant2.playerId,
        winnerTag: p1Wins ? matchToSimulate.participant1.gamerTag : matchToSimulate.participant2.gamerTag,
        liveNotes: `Match completed! ${p1Wins ? matchToSimulate.participant1.gamerTag : matchToSimulate.participant2.gamerTag} takes the series.`
      };
      await updateMatch(updated);
    }
  };

  const createTournament = async (tourneyData: Partial<Tournament>) => {
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourneyData)
      });
      const data = await res.json();
      if (data.tournament) {
        setActiveTournamentId(data.tournament.id);
      }
    } catch (e) {
      const newTourney: Tournament = {
        id: `tourney-${Date.now()}`,
        title: tourneyData.title || 'Custom Tournament',
        game: tourneyData.game || 'Valorant',
        gameCategory: tourneyData.gameCategory || 'FPS',
        bannerUrl: tourneyData.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        gameIcon: 'Trophy',
        description: tourneyData.description || '',
        status: 'registration_open',
        prizePool: tourneyData.prizePool || '$5,000 USD',
        format: tourneyData.format || 'Single Elimination',
        maxParticipants: tourneyData.maxParticipants || 8,
        registeredCount: 0,
        startDate: tourneyData.startDate || new Date().toISOString().split('T')[0],
        location: tourneyData.location || 'Online',
        currentRound: 'Registration Open',
        matches: [],
        participants: []
      };
      setTournaments((prev) => [...prev, newTourney]);
      setActiveTournamentId(newTourney.id);
    }
  };

  return {
    tournaments,
    activeTournament,
    activeTournamentId,
    setActiveTournamentId,
    spectatorCount,
    activityFeed,
    allPlayers,
    isConnected,
    updateMatch,
    registerPlayer,
    toggleCheckIn,
    resetBracket,
    simulateNextMatch,
    createTournament
  };
}
