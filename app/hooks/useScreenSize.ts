import {useState, useEffect} from "react";

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | ""
  >("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("xs");
      } else if (window.innerWidth >= 640 && window.innerWidth < 768) {
        setScreenSize("sm");
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setScreenSize("md");
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setScreenSize("lg");
      } else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
        setScreenSize("xl");
      } else if (window.innerWidth >= 1536) {
        setScreenSize("2xl");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize
}


// import {useState, useEffect} from "react";

// export const useScreenSize = () => {
//   const [screenSize, setScreenSize] = useState<
//     "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | ""
//   >("");

//   useEffect(() => {
//     const queries: { query: string; size: typeof screenSize }[] = [
//       { query: "(max-width: 639px)", size: "xs" },
//       { query: "(min-width: 640px) and (max-width: 767px)", size: "sm" },
//       { query: "(min-width: 768px) and (max-width: 1023px)", size: "md" },
//       { query: "(min-width: 1024px) and (max-width: 1279px)", size: "lg" },
//       { query: "(min-width: 1280px) and (max-width: 1535px)", size: "xl" },
//       { query: "(min-width: 1536px)", size: "2xl" },
//     ];

//     const mqls = queries.map((q) => ({ mql: window.matchMedia(q.query), size: q.size }));

//     const applyMatches = () => {
//       const matched = mqls.find((m) => m.mql.matches);
//       setScreenSize(matched ? matched.size : "");
//     };

//     // listener that works with both addEventListener and addListener
//     const createListener = (mql: MediaQueryList) => (ev: MediaQueryListEvent | MediaQueryList) => {
//       if (ev.matches) applyMatches();
//     };

//     mqls.forEach(({ mql }) => {
//       const listener = createListener(mql as MediaQueryList);
//       if (typeof mql.addEventListener === "function") {
//         mql.addEventListener("change", listener as EventListener);
//       } else if (typeof (mql).addListener === "function") {
//         (mql).addListener(listener);
//       }
//     });

//     // run once to set initial size
//     applyMatches();

//     return () => {
//       mqls.forEach(({ mql }) => {
//         const listener = createListener(mql as MediaQueryList);
//         if (typeof mql.removeEventListener === "function") {
//           mql.removeEventListener("change", listener as EventListener);
//         } else if (typeof (mql).removeListener === "function") {
//           (mql).removeListener(listener);
//         }
//       });
//     };
//   }, []);

//   return screenSize;
// };
