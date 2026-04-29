"use client";

import { Event } from "@/app/types/event.model";
import { PlayerScore, ScoringFormat, TeamScore } from "@/app/types/round.model";
import { useState } from "react";
import CreateRoundScoringFormatRadio from "./CreateRoundScoringFormatRadio";
import PlayersInRoundChooser from "./PlayersInRoundChooser";
import TeamsInRoundChooser, { ActiveTeam } from "./TeamsInRoundChooser";
import { SimplePlayer } from "@/app/types/player.model";
import HoleSection from "./HoleSection";
import TeamHoleSection from "./TeamHoleSection";
import { holeDefaultData } from "../data/holeDefaultData";
import Button from "@/app/components/button/Button";
import { Users, User } from "lucide-react";
import { adminPost } from "@/lib/adminClient";

export type HoleInput = {
  holeNumber: number;
  par: number;
  playerScores?: PlayerScore[]; // for individual rounds
  teamScores?: TeamScore[]; // for team rounds
  scoringFormatOverride?: ScoringFormat;
};

interface CreateRoundProps {
  selectedEvent: Event | null;
}

export default function CreateRound({ selectedEvent }: CreateRoundProps) {
  const isTeamEvent = selectedEvent?.teamEvent || false;

  const [scoringFormat, setScoringFormat] = useState<ScoringFormat>("stroke");
  const [holes, setHoles] = useState<HoleInput[]>(holeDefaultData);
  const [activePlayers, setActivePlayers] = useState<SimplePlayer[]>([]);
  const [activeTeams, setActiveTeams] = useState<ActiveTeam[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateIndividualRound = async () => {
    if (!selectedEvent) {
      alert("Velg et arrangement først");
      return;
    }

    if (!activePlayers || activePlayers.length === 0) {
      alert("Legg til minst én spiller i runden");
      return;
    }

    const payload = {
      eventId: selectedEvent.id,
      scoringFormat,
      holes: holes.map((h) => ({
        holeNumber: h.holeNumber,
        par: h.par,
        scoringFormatOverride: h.scoringFormatOverride ?? null,
        playerScores: (h.playerScores ?? activePlayers.map((p) => ({ playerId: p.id, throws: h.par || 3 }))) || [],
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await adminPost("/api/admin/round/individual", payload);

      if (!res.ok) {
        const text = await res.text();
        console.error("Create round failed:", text);
        alert("Kunne ikke opprette runden: " + res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Round created:", data);
      alert("Runde opprettet!");
    } catch (err) {
      console.error(err);
      alert("Feil ved oppretting av runde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTeamRound = async () => {
    if (!selectedEvent) {
      alert("Velg et arrangement først");
      return;
    }

    if (activeTeams.length === 0) {
      alert("Velg minst ett lag for runden");
      return;
    }

    // Validate that all holes have team scores
    const hasScores = holes.every((h) => h.teamScores && h.teamScores.length > 0);

    if (!hasScores) {
      alert("Alle hull må ha lagscorer. Klikk på hvert hull for å registrere kast.");
      return;
    }

    const payload = {
      eventId: selectedEvent.id,
      scoringFormat,
      holes: holes.map((h) => ({
        holeNumber: h.holeNumber,
        par: h.par,
        scoringFormatOverride: h.scoringFormatOverride ?? null,
        teamScores: (h.teamScores ?? []).map((ts) => ({
          teamId: ts.teamId,
          teamThrows: ts.teamThrows,
          memberScores: ts.memberScores.map((ms) => ({
            playerId: ms.playerId,
            throws: scoringFormat === "stroke" ? ms.throws : ts.teamThrows,
            isCounted: true,
          })),
        })),
      })),
    };

    setIsSubmitting(true);
    try {
      const res = await adminPost("/api/admin/round/team", payload);

      if (!res.ok) {
        const text = await res.text();
        console.error("Create team round failed:", text);
        alert("Kunne ikke opprette lagrunden: " + res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Team round created:", data);
      alert("Lagrunde opprettet!");
    } catch (err) {
      console.error(err);
      alert("Feil ved oppretting av lagrunde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRound = () => {
    if (isTeamEvent) {
      handleCreateTeamRound();
    } else {
      handleCreateIndividualRound();
    }
  };

  // When updating activePlayers, set default playerScores for new players in holes
  const updateActivePlayers = (players: SimplePlayer[]) => {
    setActivePlayers(players);
    setHoles((prevHoles) =>
      prevHoles.map((hole) => {
        const updatedPlayerScores = players.map((player) => {
          const existingScore = hole.playerScores?.find((ps) => ps.playerId === player.id);
          return existingScore || { playerId: player.id, throws: hole.par || 3 };
        });
        return { ...hole, playerScores: updatedPlayerScores };
      }),
    );
  };

  // When updating activeTeams, set default teamScores for new teams in holes
  const updateActiveTeams = (teams: ActiveTeam[]) => {
    setActiveTeams(teams);
    setHoles((prevHoles) =>
      prevHoles.map((hole) => {
        const updatedTeamScores: TeamScore[] = teams.map((team) => {
          const existingScore = hole.teamScores?.find((ts) => ts.teamId === team.id);
          if (existingScore) return existingScore;
          const defaultThrows = hole.par || 3;
          return {
            teamId: team.id,
            memberScores: team.members.map((m) => ({ playerId: m.playerId, throws: defaultThrows })),
            teamThrows: scoringFormat === "stroke" ? defaultThrows * team.members.length : defaultThrows,
          };
        });
        return { ...hole, teamScores: updatedTeamScores };
      }),
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto p-4">
      {/* Round type indicator */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2 w-fit">
        {isTeamEvent ? <Users className="size-4 text-primary" /> : <User className="size-4 text-primary" />}
        <span className="text-sm font-medium">{isTeamEvent ? "Lagrunde" : "Individuell runde"}</span>
      </div>

      <div className="flex gap-8 flex-wrap">
        <section className="border rounded-lg p-4">
          <CreateRoundScoringFormatRadio scoringFormat={scoringFormat} setScoringFormat={setScoringFormat} />
        </section>

        <section className="border rounded-lg p-4 gap-2 flex flex-col flex-1 min-w-70">
          {isTeamEvent ? (
            <>
              <h2 className="text-md font-semibold">VELG LAG FOR RUNDEN</h2>
              <TeamsInRoundChooser activeTeams={activeTeams} setActiveTeams={updateActiveTeams} />
            </>
          ) : (
            <>
              <h2 className="text-md font-semibold">VELG SPILLERE FOR RUNDEN</h2>
              <PlayersInRoundChooser
                selectedEvent={selectedEvent}
                activePlayers={activePlayers}
                updateActivePlayers={updateActivePlayers}
              />
            </>
          )}
        </section>
      </div>

      <section className="border rounded-lg p-4 gap-2 flex flex-col">
        <h2 className="text-md font-semibold">HULL FOR RUNDEN</h2>
        {isTeamEvent ? (
          <TeamHoleSection
            selectedEvent={selectedEvent}
            holes={holes}
            setHoles={setHoles}
            activeTeams={activeTeams}
            scoringFormat={scoringFormat}
          />
        ) : (
          <HoleSection selectedEvent={selectedEvent} holes={holes} setHoles={setHoles} activePlayers={activePlayers} />
        )}
      </section>

      <Button className="self-end" onClick={handleCreateRound} disabled={isSubmitting}>
        {isSubmitting ? "OPPRETTER..." : "OPPRETT RUNDE"}
      </Button>
    </div>
  );
}
