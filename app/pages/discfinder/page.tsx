"use client";
import HeaderSection from "@/app/components/sections/HeaderSection";
import DiscInput from "./components/DiscInput";
import { useState } from "react";
import { FlightNumber } from "@/app/types/flight-number.enum";
import Button from "@/app/components/button/Button";

const DiscFinderPage = () => {
  const [speed, setSpeed] = useState<number>(FlightNumber.NO_RATING);
  const [glide, setGlide] = useState<number>(FlightNumber.NO_RATING);
  const [turn, setTurn] = useState<number>(FlightNumber.NO_RATING);
  const [fade, setFade] = useState<number>(FlightNumber.NO_RATING);

  //   TODO: Legg til funksjonalitet for å finne disker basert på input verdier.

  return (
    <>
      <HeaderSection
        title="DiscFinder"
        text="Bruk input feltene for å finne din perfekte disc!"
      />
      <main className="flex w-full flex-col items-center justify-between sm:items-start gap-4 md:gap-8">
        <section className="grid grid-cols-2 gap-4 w-full p-4 md:p-16 md:grid-cols-4">
          <DiscInput
            min={1}
            max={14}
            title={"Speed"}
            description={"Styrke"}
            value={speed}
            onChange={(value) => setSpeed(value)}
          />
          <DiscInput
            min={1}
            max={7}
            title={"Glide"}
            description={"Glid"}
            value={glide}
            onChange={(value) => setGlide(value)}
          />
          <DiscInput
            min={-5}
            max={1}
            title={"Turn"}
            description={"Sving i starten"}
            value={turn}
            onChange={(value) => setTurn(value)}
          />
          <DiscInput
            min={0}
            max={5}
            title={"Fade"}
            description={"Spinn på slutten"}
            value={fade}
            onChange={(value) => setFade(value)}
          />
        </section>
        <section className="flex w-full h-16 items-center justify-center">
          {/* Her kan vi legge til en knapp for å søke etter disker basert på input verdier */}
          <Button>Finn Discer</Button>
        </section>
      </main>
    </>
  );
};

export default DiscFinderPage;
