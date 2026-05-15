import HeaderSection from "./components/sections/HeaderSection";
import UpcomingEvent from "./components/sections/UpcomingEvent";
import HallOfFame from "./components/sections/HallOfFame";
import TopWeatherLocations from "./components/sections/TopWeatherLocations";
import HeroDiscArc from "./components/animations/HeroDiscArc";

export default function Home() {
  return (
    <div className="flex justify-center font-sans p-4">
      <HeroDiscArc />
      <main className="flex w-full flex-col items-center justify-between pt-16 md:pt-32 sm:items-start gap-8 md:gap-16">
        <section className="flex w-full justify-center items-center px-4 md:px-0">
          <HeaderSection
            title="Velkommen til Disckos"
            text="Her kan du følge med på når vi skal spille! Lag deg en profil!"
          />
        </section>
        <section className="flex justify-center items-center w-full mx-4">
          <UpcomingEvent />
        </section>
        <section className="flex justify-center items-center w-full">
          <TopWeatherLocations />
        </section>

        <section className="flex justify-center items-center w-full">
          <HallOfFame />
        </section>

        <section className="flex justify-center items-center w-full text-sm text-muted-foreground">
          &copy; 2026 Disckos. Laget med ❤️ av Disckos-teamet.
        </section>
      </main>
    </div>
  );
}
