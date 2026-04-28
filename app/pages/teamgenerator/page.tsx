"use client";

import { useState, useCallback, useRef } from "react";
import HeaderSection from "@/app/components/sections/HeaderSection";
import { Player } from "@/app/types/player.model";
import { Gender } from "@/app/types/gender.enum";
import useFetch from "@/app/hooks/useFetch";
import { Card } from "@/components/ui/card";
import styles from "./teamgenerator.module.css";
import Button from "@/app/components/button/Button";

const TEAM_COLORS = [
  "var(--primary)",
  "var(--warm)",
  "var(--chart-5)",
  "var(--chart-4)",
  "var(--destructive)",
  "var(--chart-3)",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamGeneratorPage() {
  const { data: players = [] } = useFetch<Player[]>("/api/player");
  const [participatingPlayers, setParticipatingPlayers] = useState<Player[]>([]);
  const [customPlayers, setCustomPlayers] = useState<Player[]>([]);
  const [customPlayerInput, setCustomPlayerInput] = useState("");
  const [teams, setTeams] = useState<Player[][]>([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const teamsRef = useRef<HTMLDivElement>(null);

  const isSelected = useCallback(
    (player: Player) => participatingPlayers.some((p) => p.id === player.id),
    [participatingPlayers],
  );

  const handleParticipantSelect = (player: Player) => {
    setParticipatingPlayers((prev) =>
      prev.find((p) => p.id === player.id) ? prev.filter((p) => p.id !== player.id) : [...prev, player],
    );
  };

  const selectAll = () => {
    const allPlayers = [...players, ...customPlayers];
    setParticipatingPlayers(allPlayers);
  };

  const deselectAll = () => {
    setParticipatingPlayers([]);
  };

  const addCustomPlayer = () => {
    if (customPlayerInput.trim() === "") return;
    const newPlayer: Player = {
      id: `custom-${Date.now()}`,
      name: customPlayerInput.trim(),
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
    setIsShuffling(true);
    // Brief delay for the animation feel
    setTimeout(() => {
      const shuffled = [...participatingPlayers].sort(() => Math.random() - 0.5);
      const newTeams: Player[][] = Array.from({ length: numberOfTeams }, () => []);
      shuffled.forEach((player, index) => {
        newTeams[index % numberOfTeams].push(player);
      });
      setTeams(newTeams);
      setRevealKey((k) => k + 1);
      setIsShuffling(false);
      // Scroll to teams after a tiny delay
      setTimeout(() => {
        teamsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 400);
  };

  const resetAll = () => {
    setTeams([]);
    setParticipatingPlayers([]);
    setCustomPlayers([]);
    setNumberOfTeams(2);
  };

  const totalSelected = participatingPlayers.length;
  const canGenerate = totalSelected >= 2;

  return (
    <>
      <HeaderSection title="Lagbygger" text="Velg spillere og generer tilfeldige lag på et blunk!" />

      <main className={styles.container}>
        {/* ── Step 1: Player Selection ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepBadge}>1</div>
            <div>
              <h2 className={styles.sectionTitle}>Velg spillere</h2>
              <p className={styles.sectionSubtitle}>
                {totalSelected === 0
                  ? "Trykk på spillere for å legge dem til"
                  : `${totalSelected} spiller${totalSelected !== 1 ? "e" : ""} valgt`}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          {players.length > 0 && (
            <div className={styles.quickActions}>
              <button className={styles.quickActionBtn} onClick={selectAll}>
                Velg alle
              </button>
              {totalSelected > 0 && (
                <button className={styles.quickActionBtn} onClick={deselectAll}>
                  Fjern alle
                </button>
              )}
            </div>
          )}

          {/* Player chips grid */}
          <div className={styles.playerGrid}>
            {players.map((player) => (
              <button
                key={player.id}
                className={`${styles.playerChip} ${isSelected(player) ? styles.chipSelected : ""}`}
                onClick={() => handleParticipantSelect(player)}
              >
                <span className={styles.chipAvatar}>{getInitials(player.name)}</span>
                <span className={styles.chipName}>{player.name}</span>
                {isSelected(player) && <span className={styles.chipCheck}>✓</span>}
              </button>
            ))}
          </div>

          {/* Custom players */}
          {customPlayers.length > 0 && (
            <>
              <p className={styles.customLabel}>Gjestespillere</p>
              <div className={styles.playerGrid}>
                {customPlayers.map((player) => (
                  <div key={player.id} className={styles.customChipWrap}>
                    <button
                      className={`${styles.playerChip} ${isSelected(player) ? styles.chipSelected : ""}`}
                      onClick={() => handleParticipantSelect(player)}
                    >
                      <span className={styles.chipAvatar}>{getInitials(player.name)}</span>
                      <span className={styles.chipName}>{player.name}</span>
                      {isSelected(player) && <span className={styles.chipCheck}>✓</span>}
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeCustomPlayer(player.id)}
                      aria-label={`Fjern ${player.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Add custom player */}
          <div className={styles.addPlayerRow}>
            <input
              className={styles.addPlayerInput}
              type="text"
              placeholder="Legg til gjestespiller..."
              value={customPlayerInput}
              onChange={(e) => setCustomPlayerInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomPlayer()}
            />
            <Button onClick={addCustomPlayer} disabled={customPlayerInput.trim() === ""}>
              + Legg til
            </Button>
          </div>
        </section>

        {/* ── Step 2: Configure ── */}
        <section className={`${styles.section} ${!canGenerate ? styles.sectionDisabled : ""}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.stepBadge}>2</div>
            <div>
              <h2 className={styles.sectionTitle}>Antall lag</h2>
              <p className={styles.sectionSubtitle}>
                {canGenerate
                  ? `${totalSelected} spillere fordeles på ${numberOfTeams} lag`
                  : "Velg minst 2 spillere for å fortsette"}
              </p>
            </div>
          </div>

          <div className={styles.teamStepper}>
            <button
              className={styles.stepperBtn}
              disabled={!canGenerate || numberOfTeams <= 1}
              onClick={() => setNumberOfTeams((prev) => Math.max(1, prev - 1))}
            >
              −
            </button>
            <span className={styles.stepperValue}>{numberOfTeams}</span>
            <button
              className={styles.stepperBtn}
              disabled={!canGenerate || numberOfTeams >= totalSelected}
              onClick={() => setNumberOfTeams((prev) => Math.min(totalSelected, prev + 1))}
            >
              +
            </button>
          </div>

          <Button
            className={`${styles.generateBtn} ${isShuffling ? styles.shuffling : ""}`}
            onClick={generateTeamsRandomly}
            disabled={!canGenerate || isShuffling}
          >
            {teams.length > 0 ? "🔀 Bland på nytt!" : "🎲 Generer lag!"}
          </Button>
        </section>

        {/* ── Step 3: Teams Display ── */}
        {teams.length > 0 && (
          <section className={styles.section} ref={teamsRef} key={revealKey}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.stepBadge} ${styles.stepBadgeDone}`}>✓</div>
              <div>
                <h2 className={styles.sectionTitle}>Lagene er klare!</h2>
                <p className={styles.sectionSubtitle}>
                  {teams.length} lag med {totalSelected} spillere
                </p>
              </div>
            </div>

            <div className={styles.teamsGrid}>
              {teams.map((team, index) => (
                <Card
                  key={index}
                  className={styles.teamCard}
                  style={
                    {
                      "--team-color": TEAM_COLORS[index % TEAM_COLORS.length],
                      animationDelay: `${index * 100}ms`,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.teamHeader}>
                    <span className={styles.teamNumber}>{index + 1}</span>
                    <div>
                      <h3 className={styles.teamName}>Lag {index + 1}</h3>
                      <span className={styles.teamCount}>
                        {team.length} spiller{team.length !== 1 ? "e" : ""}
                      </span>
                    </div>
                  </div>
                  <ul className={styles.teamMembers}>
                    {team.map((player) => (
                      <li key={player.id} className={styles.memberTag}>
                        <span className={styles.memberAvatar}>{getInitials(player.name)}</span>
                        {player.name}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className={styles.actionRow}>
              <Button onClick={generateTeamsRandomly} disabled={isShuffling}>
                🔀 Bland på nytt
              </Button>
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
