"use client";

import { useState } from "react";
import HeaderSection from "@/app/components/sections/HeaderSection";
import { Player } from "@/app/types/player.model";
import { Gender } from "@/app/types/gender.enum";
import useFetch from "@/app/hooks/useFetch";
import { Card } from "@/components/ui/card";
import styles from "./teamgenerator.module.css";
import Button from "@/app/components/button/Button";

export default function TeamGeneratorPage() {
  const { data: players = [] } = useFetch<Player[]>("/api/player");
  const [participatingPlayers, setParticipatingPlayers] = useState<Player[]>([]);
  const [customPlayers, setCustomPlayers] = useState<Player[]>([]);
  const [customPlayerInput, setCustomPlayerInput] = useState("");
  const [teams, setTeams] = useState<Player[][]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  const handleParticipantSelect = (player: Player) => {
    setParticipatingPlayers((prev) =>
      prev.find((p) => p.id === player.id) ? prev.filter((p) => p.id !== player.id) : [...prev, player],
    );
  };

  const addCustomPlayer = () => {
    if (customPlayerInput.trim() === "") return;
    const newPlayer: Player = {
      id: `custom-${Date.now()}`,
      name: customPlayerInput,
      gender: Gender.OTHER,
    };
    setCustomPlayers((prev) => [...prev, newPlayer]);
    setParticipatingPlayers((prev) => [...prev, newPlayer]);
    setCustomPlayerInput("");
  };

  const removeCustomPlayer = (id: string) => {
    setCustomPlayers((prev) => prev.filter((p) => p.id !== id));
    setParticipatingPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const generateTeamsRandomly = () => {
    const shuffled = [...participatingPlayers].sort(() => Math.random() - 0.5);
    const newTeams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
    shuffled.forEach((player, index) => {
      newTeams[index % numberOfTeams].push(player);
    });
    setTeams(newTeams);
  };

  const resetAll = () => {
    setTeams([]);
    setParticipatingPlayers([]);
    setCustomPlayers([]);
    setNumberOfTeams(2);
  };

  return (
    <>
      <HeaderSection
        title="Lagbygger"
        text="Her er lagbyggeren for å velge lag! Denne er vibe-codet, så kan være noen problemer 😅"
      />
      <main className={styles.container}>
        {/* Player Selection */}
        <section className={styles.modeContent}>
          <h2>Velg spillere som skal spille</h2>

          {/* Database Players */}
          <div className={styles.playerList}>
            <div className={styles.playerGrid}>
              {players.map((player) => (
                <button
                  key={player.id}
                  className={`${styles.playerButton} ${
                    participatingPlayers.some((p) => p.id === player.id) ? styles.selected : ""
                  }`}
                  onClick={() => handleParticipantSelect(player)}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Player Input */}
          <div className={styles.customPlayerSection}>
            <div className={styles.customPlayerInput}>
              <input
                type="text"
                placeholder="Skriv inn navn på ny spiller"
                value={customPlayerInput}
                onChange={(e) => setCustomPlayerInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomPlayer()}
              />
              {customPlayerInput.trim() !== "" && <Button onClick={addCustomPlayer}>Legg til spiller</Button>}
            </div>

            {/* Display Custom Players */}
            {customPlayers.length > 0 && (
              <div className={styles.customPlayersList}>
                <p className={styles.customPlayersLabel}>Egendefinerte spillere:</p>
                <div className={styles.playerGrid}>
                  {customPlayers.map((player) => (
                    <div key={player.id} className={styles.customPlayerItem}>
                      <button
                        className={`${styles.playerButton} ${
                          participatingPlayers.some((p) => p.id === player.id) ? styles.selected : ""
                        }`}
                        onClick={() => handleParticipantSelect(player)}
                      >
                        {player.name}
                      </button>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeCustomPlayer(player.id)}
                        title="Fjern spiller"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Randomizer - appears directly when 2+ players selected */}
        {participatingPlayers.length >= 2 && teams.length === 0 && (
          <section className={styles.modeContent}>
            <div className="w-40 flex items-center justify-between">
              Antall lag: {numberOfTeams} &nbsp;
              <div className="flex gap-2">
                <button className="border px-2 border-foreground" onClick={() => setNumberOfTeams((prev) => prev + 1)}>
                  +
                </button>
                <button
                  className="border px-2 border-foreground"
                  disabled={numberOfTeams == 1}
                  onClick={() => setNumberOfTeams((prev) => (prev > 2 ? prev - 1 : 1))}
                >
                  -
                </button>
              </div>
            </div>
            <Button onClick={generateTeamsRandomly}>Generer tilfeldige lag</Button>
          </section>
        )}

        {/* Teams Display */}
        {teams.length > 0 && (
          <section className={styles.teamsDisplay}>
            <div className={styles.teamsList}>
              {teams.map((team, index) => (
                <Card key={index} className={styles.teamCard}>
                  <h3>Lag {index + 1}</h3>
                  <ul>
                    {team.map((player) => (
                      <li key={player.id}>{player.name}</li>
                    ))}
                  </ul>
                  <p className={styles.teamSize}>({team.length} spillere)</p>
                </Card>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button onClick={generateTeamsRandomly}>Scramble lag</Button>
              <Button variant="outline" onClick={resetAll}>
                Start på nytt
              </Button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
