import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { INITIAL_TOURNAMENTS, INITIAL_PLAYERS, INITIAL_ACTIVITY_FEED } from './src/initialData';
import { Tournament, Match, PlayerProfile, ActivityFeedItem, TournamentState } from './src/types';

const PORT = 3000;
const app = express();
app.use(express.json());

// In-memory state
let tournaments: Tournament[] = JSON.parse(JSON.stringify(INITIAL_TOURNAMENTS));
let players: PlayerProfile[] = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
let activityFeed: ActivityFeedItem[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_FEED));
let activeTournamentId: string = tournaments[0].id;

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(data: any, excludeWs?: WebSocket) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastAll(data: any) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastSpectatorCount() {
  broadcastAll({
    type: 'SPECTATOR_COUNT',
    payload: { count: Math.max(1, wss.clients.size) }
  });
}

function getState(): TournamentState {
  return {
    tournaments,
    activeTournamentId,
    spectatorCount: Math.max(1, wss.clients.size),
    activityFeed,
    allPlayers: players
  };
}

// Logic to advance winner to next match
function updateMatchAndAdvance(tournamentId: string, updatedMatch: Match): { tournament: Tournament; activity: ActivityFeedItem } {
  const tourney = tournaments.find((t) => t.id === tournamentId);
  if (!tourney) throw new Error('Tournament not found');

  const matchIndex = tourney.matches.findIndex((m) => m.id === updatedMatch.id);
  if (matchIndex === -1) throw new Error('Match not found');

  tourney.matches[matchIndex] = updatedMatch;

  let activityType: ActivityFeedItem['type'] = 'match_score';
  let activityMsg = `Score update in ${updatedMatch.roundName}: ${updatedMatch.participant1.gamerTag} (${updatedMatch.participant1.score}) vs ${updatedMatch.participant2.gamerTag} (${updatedMatch.participant2.score})`;

  if (updatedMatch.status === 'live') {
    activityType = 'match_live';
    activityMsg = `${updatedMatch.roundName} match between ${updatedMatch.participant1.gamerTag} and ${updatedMatch.participant2.gamerTag} is now LIVE!`;
  }

  // If completed and winner exists, advance to next match or crown champion
  if (updatedMatch.status === 'completed' && (updatedMatch.winnerId || updatedMatch.winnerTag)) {
    activityType = 'match_complete';
    const winningParticipant = updatedMatch.participant1.isWinner
      ? updatedMatch.participant1
      : updatedMatch.participant2;

    activityMsg = `${winningParticipant.gamerTag} defeated ${
      updatedMatch.participant1.isWinner ? updatedMatch.participant2.gamerTag : updatedMatch.participant1.gamerTag
    } (${updatedMatch.participant1.score}-${updatedMatch.participant2.score}) in ${updatedMatch.roundName}`;

    // Update player win/loss records
    if (winningParticipant.playerId) {
      const winnerProfile = players.find(p => p.id === winningParticipant.playerId);
      if (winnerProfile) {
        winnerProfile.winLoss.wins += 1;
        winnerProfile.winLoss.winRate = Math.round((winnerProfile.winLoss.wins / (winnerProfile.winLoss.wins + winnerProfile.winLoss.losses)) * 100);
      }
    }

    if (updatedMatch.nextMatchId) {
      const nextMatch = tourney.matches.find((m) => m.id === updatedMatch.nextMatchId);
      if (nextMatch) {
        if (updatedMatch.nextMatchSlot === 1) {
          nextMatch.participant1 = {
            ...winningParticipant,
            score: 0,
            isWinner: false
          };
        } else {
          nextMatch.participant2 = {
            ...winningParticipant,
            score: 0,
            isWinner: false
          };
        }

        // If both participants in next match are filled, set status to scheduled
        if (
          nextMatch.participant1.gamerTag &&
          !nextMatch.participant1.gamerTag.startsWith('TBD') &&
          nextMatch.participant2.gamerTag &&
          !nextMatch.participant2.gamerTag.startsWith('TBD')
        ) {
          if (nextMatch.status === 'scheduled') {
            // ready to play
          }
        }
      }
    } else {
      // Grand final winner!
      tourney.champion = winningParticipant;
      tourney.status = 'completed';
      activityType = 'tournament_champion';
      activityMsg = `🏆 CHAMPION CROWNED! ${winningParticipant.gamerTag} wins the ${tourney.title}!`;
    }
  }

  const newActivity: ActivityFeedItem = {
    id: `act-${Date.now()}`,
    tournamentId: tourney.id,
    tournamentTitle: tourney.title,
    type: activityType,
    message: activityMsg,
    details: updatedMatch.liveNotes || `Best of ${updatedMatch.bestOf} series`,
    timestamp: 'Just now'
  };

  activityFeed.unshift(newActivity);
  if (activityFeed.length > 50) activityFeed.pop();

  return { tournament: tourney, activity: newActivity };
}

// REST Endpoints
app.get('/api/state', (req, res) => {
  res.json(getState());
});

app.get('/api/tournaments', (req, res) => {
  res.json(tournaments);
});

app.get('/api/tournaments/:id', (req, res) => {
  const tourney = tournaments.find((t) => t.id === req.params.id);
  if (!tourney) return res.status(404).json({ error: 'Tournament not found' });
  res.json(tourney);
});

app.get('/api/players', (req, res) => {
  res.json(players);
});

// Update match score & status
app.post('/api/tournaments/:id/matches/:matchId', (req, res) => {
  try {
    const { tournamentId, match } = req.body;
    const result = updateMatchAndAdvance(tournamentId || req.params.id, match);
    broadcastAll({
      type: 'MATCH_UPDATE',
      payload: {
        tournamentId: result.tournament.id,
        match,
        activity: result.activity
      }
    });
    res.json({ success: true, tournament: result.tournament });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Register player
app.post('/api/tournaments/:id/register', (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tourney = tournaments.find((t) => t.id === tournamentId);
    if (!tourney) return res.status(404).json({ error: 'Tournament not found' });

    const newPlayerData: Partial<PlayerProfile> = req.body;
    const newPlayer: PlayerProfile = {
      id: `p-${Date.now()}`,
      gamerTag: newPlayerData.gamerTag || 'Player',
      realName: newPlayerData.realName || 'Anonymous',
      avatar: newPlayerData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${newPlayerData.gamerTag}`,
      country: newPlayerData.country || { code: 'US', name: 'United States' },
      mainGame: tourney.game,
      rankTier: newPlayerData.rankTier || 'Diamond 1',
      team: newPlayerData.team || (newPlayerData.gamerTag ? { name: `${newPlayerData.gamerTag} Squad`, tag: newPlayerData.gamerTag.substring(0, 3).toUpperCase() } : undefined),
      bio: newPlayerData.bio || 'Competitive tournament participant.',
      socialDiscord: newPlayerData.socialDiscord,
      socialSteamOrRiot: newPlayerData.socialSteamOrRiot,
      winLoss: { wins: 0, losses: 0, winRate: 0 },
      tournamentStats: { tournamentsPlayed: 1, championships: 0, runnerUp: 0, totalPrizeWon: 0 },
      matchHistory: [],
      isCheckedIn: true,
      registeredAt: new Date().toISOString()
    };

    players.push(newPlayer);
    tourney.participants.push(newPlayer);
    tourney.registeredCount = tourney.participants.length;

    const newActivity: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      tournamentId: tourney.id,
      tournamentTitle: tourney.title,
      type: 'player_registered',
      message: `${newPlayer.gamerTag} registered for ${tourney.title}`,
      details: `Slot ${tourney.registeredCount}/${tourney.maxParticipants} claimed. Rank: ${newPlayer.rankTier}`,
      timestamp: 'Just now'
    };

    activityFeed.unshift(newActivity);

    broadcastAll({
      type: 'REGISTER_PLAYER',
      payload: {
        tournamentId: tourney.id,
        player: newPlayer,
        activity: newActivity
      }
    });

    res.json({ success: true, player: newPlayer, tournament: tourney });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle check-in
app.post('/api/tournaments/:id/checkin', (req, res) => {
  const { playerId, isCheckedIn } = req.body;
  const tourney = tournaments.find((t) => t.id === req.params.id);
  if (!tourney) return res.status(404).json({ error: 'Tournament not found' });

  const player = tourney.participants.find((p) => p.id === playerId);
  if (player) {
    player.isCheckedIn = isCheckedIn;
    broadcastAll({
      type: 'TOGGLE_CHECKIN',
      payload: { tournamentId: tourney.id, playerId, isCheckedIn }
    });
  }
  res.json({ success: true });
});

// Reset bracket
app.post('/api/tournaments/:id/reset', (req, res) => {
  const tourney = tournaments.find((t) => t.id === req.params.id);
  if (!tourney) return res.status(404).json({ error: 'Tournament not found' });

  const initialTourney = INITIAL_TOURNAMENTS.find((t) => t.id === req.params.id);
  if (initialTourney) {
    tourney.matches = JSON.parse(JSON.stringify(initialTourney.matches));
    tourney.status = initialTourney.status;
    tourney.champion = undefined;
  }

  const newActivity: ActivityFeedItem = {
    id: `act-${Date.now()}`,
    tournamentId: tourney.id,
    tournamentTitle: tourney.title,
    type: 'match_score',
    message: `Tournament brackets for ${tourney.title} were reset by the tournament organizer.`,
    timestamp: 'Just now'
  };
  activityFeed.unshift(newActivity);

  broadcastAll({
    type: 'RESET_BRACKET',
    payload: { tournamentId: tourney.id, matches: tourney.matches, activity: newActivity }
  });

  res.json({ success: true, matches: tourney.matches });
});

// Create new tournament
app.post('/api/tournaments', (req, res) => {
  const newTourney: Tournament = {
    ...req.body,
    id: `tourney-${Date.now()}`,
    registeredCount: req.body.participants?.length || 0,
    matches: req.body.matches || []
  };
  tournaments.push(newTourney);

  const newActivity: ActivityFeedItem = {
    id: `act-${Date.now()}`,
    tournamentId: newTourney.id,
    tournamentTitle: newTourney.title,
    type: 'match_live',
    message: `New tournament announced: ${newTourney.title}! Registration is open!`,
    details: `Prize Pool: ${newTourney.prizePool} | Max ${newTourney.maxParticipants} players`,
    timestamp: 'Just now'
  };
  activityFeed.unshift(newActivity);

  broadcastAll({
    type: 'TOURNAMENT_CREATE',
    payload: { tournament: newTourney, activity: newActivity }
  });

  res.json({ success: true, tournament: newTourney });
});

// WebSocket Handler
wss.on('connection', (ws: WebSocket) => {
  // Send initial state on connect
  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    payload: getState()
  }));

  broadcastSpectatorCount();

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'MATCH_UPDATE') {
        const result = updateMatchAndAdvance(data.payload.tournamentId, data.payload.match);
        broadcastAll({
          type: 'MATCH_UPDATE',
          payload: {
            tournamentId: result.tournament.id,
            match: data.payload.match,
            activity: result.activity
          }
        });
      } else if (data.type === 'TOGGLE_CHECKIN') {
        const tourney = tournaments.find(t => t.id === data.payload.tournamentId);
        if (tourney) {
          const player = tourney.participants.find(p => p.id === data.payload.playerId);
          if (player) {
            player.isCheckedIn = data.payload.isCheckedIn;
            broadcastAll({
              type: 'TOGGLE_CHECKIN',
              payload: data.payload
            });
          }
        }
      } else if (data.type === 'RESET_BRACKET') {
        const tourney = tournaments.find(t => t.id === data.payload.tournamentId);
        const initialTourney = INITIAL_TOURNAMENTS.find(t => t.id === data.payload.tournamentId);
        if (tourney && initialTourney) {
          tourney.matches = JSON.parse(JSON.stringify(initialTourney.matches));
          tourney.status = initialTourney.status;
          tourney.champion = undefined;
          const newActivity: ActivityFeedItem = {
            id: `act-${Date.now()}`,
            tournamentId: tourney.id,
            tournamentTitle: tourney.title,
            type: 'match_score',
            message: `Brackets for ${tourney.title} reset to initial state.`,
            timestamp: 'Just now'
          };
          activityFeed.unshift(newActivity);
          broadcastAll({
            type: 'RESET_BRACKET',
            payload: { tournamentId: tourney.id, matches: tourney.matches, activity: newActivity }
          });
        }
      }
    } catch (e) {
      console.error('Error handling WS message:', e);
    }
  });

  ws.on('close', () => {
    broadcastSpectatorCount();
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Tournament Server running on http://localhost:${PORT}`);
  });
}

start();
