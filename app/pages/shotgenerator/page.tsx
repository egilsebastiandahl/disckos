"use client";

import HeaderSection from "@/app/components/sections/HeaderSection";
import { shotData } from "./data/shot.data";
import ShotCategory from "./components/ShotCategory";
import RouletteWheel from "./components/RouletteWheel";
import { useState } from "react";
import ShotButtons from "./components/ShotButtons";
import { ShotType } from "./types/shot-type.enum";

interface ShotResult {
  [category: string]: {
    options: string[];
    selected: string;
  };
}

const ShotgeneratorPage = () => {
  const [currentShot, setCurrentShot] = useState<ShotResult | null>(null);
  const [spinningCategories, setSpinningCategories] = useState<Set<string>>(new Set());
  const [selectedMode, setSelectedMode] = useState<ShotType | null>(null);

  const getVisibleCategories = () => {
    return shotData.filter((category) => {
      if (category.category === "Ekstra") {
        // Ekstra only shows for Wildcard mode
        return selectedMode === ShotType.WILDCARD;
      }
      if (category.category === "Lag") {
        // Lag only shows for Team mode
        return selectedMode === ShotType.TEAM;
      }
      // All other categories show for Single and Team, but not for Wildcard
      if (selectedMode === ShotType.WILDCARD) {
        return false;
      }
      return true;
    });
  };

  const generateShot = (mode: ShotType) => {
    setSelectedMode(mode);
    const result: ShotResult = {};
    const visibleCategories = shotData.filter((category) => {
      if (category.category === "Ekstra") {
        return mode === ShotType.WILDCARD;
      }
      if (category.category === "Lag") {
        return mode === ShotType.TEAM;
      }
      if (mode === ShotType.WILDCARD) {
        return false;
      }
      return true;
    });

    visibleCategories.forEach((type) => {
      const activeItems = type.items.filter((e) => e.isActive);
      let selectedNames: string[] = [];

      switch (type.category) {
        case "Disctype":
        case "Stabilitet":
        case "Type":
        case "Kastemåte":
        case "Lag":
          // allowed 1 selection
          selectedNames = getRandomShotText(type.items, 1);
          break;
        case "Ekstra":
          // allowed 2 selections
          selectedNames = getRandomShotText(type.items, 2);
          // if certain extra elements are contained, remove all other elements.
          if (selectedNames.includes("Kamerat velger") || selectedNames.includes("Konkurrent velger")) {
            selectedNames = selectedNames.filter((e) => e == "Kamerat velger" || e == "Konkurrent velger");
          }
          break;
        default:
          selectedNames = ["Ugyldig konfigurasjon"];
      }

      result[type.category] = {
        options: activeItems.map((item) => item.title),
        selected: selectedNames.join(", "),
      };
    });

    setCurrentShot(result);
    // Start spinning all wheels
    setSpinningCategories(new Set(visibleCategories.map((d) => d.category)));
  };

  const handleSpinComplete = (category: string) => {
    // Remove from spinning categories after animation completes
    setSpinningCategories((prev) => {
      const updated = new Set(prev);
      updated.delete(category);
      return updated;
    });
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
      <HeaderSection title="Shot-generator" text="Her kan du rulle om hvilket kast du skal bruke!" />
      <main className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center w-full">
        <ShotButtons style={{ marginBottom: 36 }} onPress={generateShot} />
        {currentShot && (
          <section className="w-full mb-12">
            <div className="flex flex-col gap-8 w-full">
              {getVisibleCategories().map((shotType) => (
                <RouletteWheel
                  key={shotType.category}
                  category={shotType.category}
                  options={currentShot[shotType.category]?.options || []}
                  selected={currentShot[shotType.category]?.selected || ""}
                  isSpinning={spinningCategories.has(shotType.category)}
                  onSpinComplete={() => handleSpinComplete(shotType.category)}
                />
              ))}
            </div>
          </section>
        )}
        {/* <section className="flex gap-8 flex-wrap">
          {shotData.map((shot) => {
            return <ShotCategory key={shot.category} shotData={shot} />;
          })}
        </section> */}
      </main>
    </>
  );
};

export default ShotgeneratorPage;
