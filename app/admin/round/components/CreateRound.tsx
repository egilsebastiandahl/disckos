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

  const handleCreateRound = async (roundData: Partial<Round>) => {
    // Implementer logikk for å sende roundData til backend for å opprette en ny runde
    // roundData bør inneholde eventId, scoringFormat, og holes med playerScores
    console.log("Creating round with data:", roundData);
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
      <Button className="self-end" onClick={() => {}}>
        OPPRETT RUNDE
      </Button>
    </div>
  );
}
