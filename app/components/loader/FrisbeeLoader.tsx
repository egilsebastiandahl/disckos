import { cn } from "@/lib/utils";

export default function FrisbeeLoader({
  className,
  size = "md",
  text,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const windPositions = [
    { left: "10%", top: "20%", duration: 2, delay: 0 },
    { left: "80%", top: "15%", duration: 1.8, delay: 0.2 },
    { left: "40%", top: "70%", duration: 2.2, delay: 0.4 },
    { left: "90%", top: "45%", duration: 1.9, delay: 0.6 },
    { left: "25%", top: "60%", duration: 2.1, delay: 0.8 },
    { left: "65%", top: "80%", duration: 2, delay: 1 },
    { left: "50%", top: "30%", duration: 1.7, delay: 1.2 },
    { left: "15%", top: "85%", duration: 2.3, delay: 1.4 },
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Wind particles flowing past */}
        <div className="absolute inset-0 -m-8">
          {windPositions.map((pos, i) => (
            <div
              key={`wind-${i}`}
              className="absolute w-12 h-[1.5px] rounded-full bg-gradient-to-l from-transparent via-blue-300/30 to-transparent dark:via-blue-400/30"
              style={{
                left: pos.left,
                top: pos.top,
                animation: `wind-flow ${pos.duration}s linear infinite`,
                animationDelay: `${pos.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Air woosh trails around disc */}
        <div
          className="absolute inset-0"
          style={{
            animation: "spin 1s linear infinite",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((rotation) => (
            <div
              key={rotation}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div
                className="absolute left-[65%] top-0 w-16 h-[2px] rounded-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-blue-500/40 animate-woosh"
                style={{
                  animationDelay: `${rotation * 0.001}s`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          ))}
        </div>

        {/* Main disc */}
        <div
          className="absolute inset-[20%] rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
          style={{
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
            animation: "spin 1s linear infinite",
          }}
        >
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50" />
        </div>
      </div>

      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes woosh {
          0% {
            opacity: 0;
            transform: scaleX(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
          100% {
            opacity: 0;
            transform: scaleX(0.5);
          }
        }

        .animate-woosh {
          animation: woosh 1s ease-in-out infinite;
        }

        @keyframes wind-flow {
          0% {
            transform: translateX(100px) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(-200px) translateY(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
