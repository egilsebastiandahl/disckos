"use client";

import { useEffect, useRef, useState } from "react";

interface RouletteWheelProps {
  category: string;
  options: string[];
  selected: string;
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

export default function RouletteWheel({ category, options, selected, isSpinning, onSpinComplete }: RouletteWheelProps) {
  const [offset, setOffset] = useState(0);
  const [wheelWidth, setWheelWidth] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const onSpinCompleteRef = useRef(onSpinComplete);

  // Update the ref when callback changes
  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
  }, [onSpinComplete]);

  // Measure wheel viewport width on mount
  useEffect(() => {
    const updateWidth = () => {
      if (wheelRef.current) {
        setWheelWidth(wheelRef.current.offsetWidth);
      }
    };

    // Small delay to ensure layout is complete
    const timer = setTimeout(updateWidth, 0);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    if (isSpinning && options.length > 0 && wheelWidth > 0) {
      // Extract first item if multiple selections are comma-separated
      const firstSelected = selected.split(",")[0].trim();
      const selectedIndex = options.indexOf(firstSelected);

      if (selectedIndex === -1) {
        onSpinCompleteRef.current?.();
        return;
      }

      const itemWidth = 120; // Width of each slot
      const slotCount = options.length;

      // Calculate where to scroll so selected item is centered
      const itemCenter = selectedIndex * itemWidth + itemWidth / 2;
      const viewportCenter = wheelWidth / 2;
      const targetPosition = itemCenter - viewportCenter;

      // Add multiple cycles for spinning effect
      const cycles = 6;
      const totalWidth = slotCount * itemWidth;
      const finalScroll = targetPosition + cycles * totalWidth;

      const duration = 2000; // 2 seconds spin
      const startTime = Date.now();
      let hasCompleted = false;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration (cubic easeOut)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentScroll = finalScroll * easeOut;
        setOffset(currentScroll);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else if (!hasCompleted) {
          hasCompleted = true;
          setOffset(finalScroll);
          onSpinCompleteRef.current?.();
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isSpinning, selected, options, wheelWidth]);

  const itemWidth = 120;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h3 className="font-semibold text-lg">{category}</h3>

      <div
        ref={wheelRef}
        className="relative w-full h-32 overflow-hidden border-4 border-foreground rounded-lg bg-background shadow-lg"
      >
        {/* Pointer at center */}
        <div
          className="absolute top-1/2 left-1/2 z-20"
          style={{
            transform: "translate(-50%, -50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid hsl(var(--primary))",
          }}
        ></div>

        {/* Center highlight bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-full bg-primary/10 pointer-events-none z-10"></div>
        </div>

        {/* Roulette wheel container */}
        <div
          className="flex h-full items-center"
          style={{
            transform: `translateX(${-offset}px)`,
            transitionDuration: "0ms",
          }}
        >
          {/* Duplicate options multiple times for infinite scroll effect */}
          {Array.from({ length: 15 }).flatMap((_, iteration) =>
            options.map((option, i) => (
              <div
                key={`${iteration}-${i}-${option}`}
                className="flex items-center justify-center flex-shrink-0 h-full border-r border-gray-300 text-center px-3 text-foreground text-sm font-medium"
                style={{
                  width: `${itemWidth}px`,
                }}
              >
                <span className="line-clamp-2">{option}</span>
              </div>
            )),
          )}
        </div>
      </div>

      {/* Display selected value below */}
      <div className="text-center">
        <p className="font-bold text-primary text-lg">{selected}</p>
      </div>
    </div>
  );
}
