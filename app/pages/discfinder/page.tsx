"use client";
import HeaderSection from "@/app/components/sections/HeaderSection";
import DiscInput from "./components/DiscInput";
import { useState } from "react";
import { FlightNumber } from "@/app/types/flight-number.enum";

const DiscFinderPage = () => {
  const [speed, setSpeed] = useState<number>(FlightNumber.NO_RATING);
  const [glide, setGlide] = useState<number>(FlightNumber.NO_RATING);
  const [turn, setTurn] = useState<number>(FlightNumber.NO_RATING);
  const [fade, setFade] = useState<number>(FlightNumber.NO_RATING);

  //   TODO: Legg til funksjonalitet for å finne disker basert på input verdier.

  return (
    <div className="flex justify-center font-sans">
      <main className="flex w-full flex-col items-center justify-between pt-32 sm:items-start gap-4 md:gap-8">
        <div className="flex w-full justify-center items-center px-4 md:px-0">
          <HeaderSection
            title="DiscFinder"
            text="Bruk input feltene for å finne din perfekte disc!"
          />
        </div>
        <div className="flex justify-center items-center w-full p-4 md:p-16 gap-4">
          <DiscInput
            min={1}
            max={14}
            title={"Speed"}
            description={"Hvor hardt du må kaste discen"}
            value={speed}
            onChange={(value) => setSpeed(value)}
          />
          <DiscInput
            min={1}
            max={7}
            title={"Glide"}
            description={"Hvor bra discen glir"}
            value={glide}
            onChange={(value) => setGlide(value)}
          />
          <DiscInput
            min={-5}
            max={1}
            title={"Turn"}
            description={"Hvor mye discen vil svinge"}
            value={turn}
            onChange={(value) => setTurn(value)}
          />
          <DiscInput
            min={0}
            max={5}
            title={"Fade"}
            description={"Hvor den går når spinnen stopper"}
            value={fade}
            onChange={(value) => setFade(value)}
          />
        </div>
      </main>
    </div>
  );
};

export default DiscFinderPage;
