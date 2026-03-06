"use client";

import { Event } from "@/app/types/event.model";
import { PlayerScore, Round, ScoringFormat, TeamScore } from "@/app/types/round.model";
import { useState } from "react";
import CreateRoundScoringFormatRadio from "./CreateRoundScoringFormatRadio";
import PlayersInRoundChooser from "./PlayersInRoundChooser";
import { SimplePlayer } from "@/app/types/player.model";
import HoleSection from "./HoleSection";
import { holeDefaultData } from "../data/holeDefaultData";
import Button from "@/app/components/button/Button";

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
  const eventType = isTeamEvent ? "team" : "individual";
  const [holes, setHoles] = useState<HoleInput[]>(holeDefaultData);
  const [activePlayers, setActivePlayers] = useState<SimplePlayer[]>([]); // For individual rounds
  const [activeTeamIds, setActiveTeamIds] = useState<string[]>([]); // For team rounds

  // Frontend shape for creating an individual round (matches backend CreateIndividualRoundRequest)
  type CreatePlayerScoreRequest = {
    playerId: string;
    throws: number;
  };

  type CreateIndividualHoleRequest = {
    holeNumber: number;
    par: number;
    scoringFormatOverride?: ScoringFormat | null;
    playerScores: CreatePlayerScoreRequest[];
  };

  type CreateIndividualRoundRequest = {
    eventId: string;
    scoringFormat: ScoringFormat;
    holes: CreateIndividualHoleRequest[];
  };

  const handleCreateRound = async () => {
    if (!selectedEvent) {
      alert("Velg et arrangement først");
      return;
    }

    if (isTeamEvent) {
      alert("Team round creation not implemented in this UI");
      return;
    }

    // basic validation
    if (!activePlayers || activePlayers.length === 0) {
      alert("Legg til minst én spiller i runden");
      return;
    }

    const payload: CreateIndividualRoundRequest = {
      eventId: selectedEvent.id,
      scoringFormat,
      holes: holes.map((h) => ({
        holeNumber: h.holeNumber,
        par: h.par,
        scoringFormatOverride: h.scoringFormatOverride ?? null,
        playerScores: (h.playerScores ?? activePlayers.map((p) => ({ playerId: p.id, throws: h.par || 3 }))) || [],
      })),
    };

    try {
      const res = await fetch("/api/admin/round/individual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create round failed:", text);
        alert("Kunne ikke opprette runden: " + res.statusText);
        return;
      }

      const data = await res.json();
      console.log("Round created:", data);
      alert("Runde opprettet");
    } catch (err) {
      console.error(err);
      alert("Feil ved oppretting av runde");
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

  /**
 * Example data for individual rounds:
 * {
"eventId": "11111111-1111-1111-1111-111111111111",
"scoringFormat": "stroke",
"holes": [
{
  "holeNumber": 1,
  "par": 3,
  "playerScores": [
    { "playerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "throws": 3 },
    { "playerId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "throws": 4 }
  ]
},
{
  "holeNumber": 2,
  "par": 4,
  "playerScores": [
    { "playerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "throws": 4 },
    { "playerId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "throws": 5 }
  ]
}
]
}
 */

  return (
    <div className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex gap-8">
        <section className="border rounded-lg p-4">
          <CreateRoundScoringFormatRadio scoringFormat={scoringFormat} setScoringFormat={setScoringFormat} />
        </section>
        <section className="border rounded-lg p-4 gap-2 flex flex-col">
          <h2 className="text-md font-semibold">VELG SPILLERE FOR RUNDEN</h2>
          <PlayersInRoundChooser
            selectedEvent={selectedEvent}
            activePlayers={activePlayers}
            updateActivePlayers={updateActivePlayers}
          />
        </section>
      </div>
      <section className="border rounded-lg p-4 gap-2 flex flex-col">
        <h2 className="text-md font-semibold">VELG HULL FOR RUNDEN</h2>
        <HoleSection selectedEvent={selectedEvent} holes={holes} setHoles={setHoles} activePlayers={activePlayers} />
      </section>
      <Button className="self-end" onClick={handleCreateRound}>
        OPPRETT RUNDE
      </Button>
    </div>
  );
}
