import {
  type PlayerRoundSummary,
  type PlayerStats,
  type PlayerStatsByLocation,
} from "@/app/types/player-stats.model";

async function getPlayerStats(playerId: string): Promise<PlayerStats> {
  const res = await fetch(`/api/player/${playerId}/stats`);
  if (!res.ok) throw new Error("Failed to fetch player stats");
  return res.json();
}

async function getPlayerStatsByLocation(
  playerId: string
): Promise<PlayerStatsByLocation> {
  const res = await fetch(`/api/player/${playerId}/stats/by-location`);
  if (!res.ok) throw new Error("Failed to fetch player stats by location");
  return res.json();
}

async function getPlayerRounds(
  playerId: string,
  limit = 20
): Promise<PlayerRoundSummary[]> {
  const res = await fetch(`/api/player/${playerId}/rounds?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch player rounds");
  return res.json();
}

const playerStatsApi = {
  getPlayerStats,
  getPlayerStatsByLocation,
  getPlayerRounds,
};

export default playerStatsApi;
