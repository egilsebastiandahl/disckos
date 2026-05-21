import { type Round } from "@/app/types/round.model";
import { supabase } from "@/lib/supabaseClient";

async function authedFetch(path: string, init: RequestInit): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Du må logge inn for å skåre.");
  return fetch(path, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

async function getRoundById(roundId: string): Promise<Round> {
  const res = await fetch(`/api/round/${roundId}`);
  if (!res.ok) throw new Error("Kunne ikke hente runde");
  return res.json();
}

async function updatePlayerScore(
  roundId: string,
  holeNumber: number,
  playerId: string,
  throws: number
): Promise<Round> {
  const res = await authedFetch(
    `/api/round/${roundId}/hole/${holeNumber}/player-score/${playerId}`,
    { method: "PATCH", body: JSON.stringify({ throws }) }
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Kunne ikke oppdatere skår (${res.status})`);
  }
  return res.json();
}

async function updateTeamScore(
  roundId: string,
  holeNumber: number,
  teamId: string,
  teamThrows: number
): Promise<Round> {
  const res = await authedFetch(
    `/api/round/${roundId}/hole/${holeNumber}/team-score/${teamId}`,
    { method: "PATCH", body: JSON.stringify({ teamThrows }) }
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Kunne ikke oppdatere lagskår (${res.status})`);
  }
  return res.json();
}

async function updateTeamMemberScore(
  roundId: string,
  holeNumber: number,
  teamId: string,
  playerId: string,
  throws: number
): Promise<Round> {
  const res = await authedFetch(
    `/api/round/${roundId}/hole/${holeNumber}/team-score/${teamId}/member/${playerId}`,
    { method: "PATCH", body: JSON.stringify({ throws }) }
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Kunne ikke oppdatere medlemskår (${res.status})`);
  }
  return res.json();
}

const scoringApi = {
  getRoundById,
  updatePlayerScore,
  updateTeamScore,
  updateTeamMemberScore,
};

export default scoringApi;
