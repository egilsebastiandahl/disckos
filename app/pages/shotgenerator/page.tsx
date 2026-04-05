"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import { shotData } from "./data/shot.data";
import ShotCategory from "./components/ShotCategory";
import Button from "@/app/components/button/Button";
import { useState } from "react";

const ShotgeneratorPage = () => {
  const [currentShot, setCurrentShot] = useState<string>("Trykk knappen");

  const generateShot = () => {
    let shotTextArray: string[] = [];
    shotData.forEach((type) => {
      switch (type.category) {
        case "Disctype":
          // allowed 1 selection
          shotTextArray = shotTextArray.concat(getRandomShotText(type.items, 1));
          break;
        case "Stabilitet":
          // allowed 1 selection
          shotTextArray = shotTextArray.concat(getRandomShotText(type.items, 1));

          break;
        case "Type":
          // allowed 1 selection
          shotTextArray = shotTextArray.concat(getRandomShotText(type.items, 1));

          break;
        case "Kastemåte":
          // allowed 1 selection
          shotTextArray = shotTextArray.concat(getRandomShotText(type.items, 1));

          break;
        case "Ekstra":
          // allowed 2 selections
          shotTextArray = shotTextArray.concat(getRandomShotText(type.items, 2));
          // if certain extra elements are contained, remove all other elements.
          if (shotTextArray.includes("Kamerat velger") || shotTextArray.includes("Konkurrent velger")) {
            shotTextArray = shotTextArray.filter((e) => e == "Kamerat velger" || e == "Konkurrent velger");
          }

          break;
        default:
          shotTextArray = ["Ugyldig konfigurasjon"];
      }
    });
    setCurrentShot(shotTextArray.join(", "));
  };

  const getRandomShotText = (items: { title: string; isActive: boolean }[], allowedAmount: number = 1): string[] => {
    let tempItems = items.filter((e) => e.isActive);
    const randomShotText: string[] = [];

    for (let i = 0; i < allowedAmount; i++) {
      const randomIndex = Math.floor(Math.random() * tempItems.length);
      randomShotText.push(tempItems[randomIndex].title);
      tempItems = tempItems.filter((e, i) => i !== randomIndex);
    }

    return randomShotText;
  };

  return (
    <>
      <HeaderSection
        title="Shot-generator"
        text="Her kan du rulle om hvilket kast du skal bruke!"
        buttonClick={generateShot}
        buttonText="Generer skudd"
      />
      <main className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
        <section>
          <p className="font-bold text-foreground">{currentShot}</p>
        </section>
        <section className="flex gap-8 flex-wrap">
          {/* <h2 className="font-bold text-xl">Innstillinger</h2> */}
          {shotData.map((shot) => {
            return <ShotCategory key={shot.category} shotData={shot} />;
          })}
        </section>
      </main>
    </>
  );
};

export default ShotgeneratorPage;
