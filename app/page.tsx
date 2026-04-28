import HeaderSection from "./components/sections/HeaderSection";
import UpcomingEvent from "./components/sections/UpcomingEvent";
import TextImage from "./components/sections/TextImage";

export default function Home() {
  return (
    <div className="flex justify-center font-sans p-4">
      <main className="flex w-full flex-col items-center justify-between pt-16 md:pt-32 sm:items-start gap-8 md:gap-16">
        <div className="flex w-full justify-center items-center px-4 md:px-0">
          <HeaderSection
            title="Velkommen til Disckos"
            text="Her kan dere følge med på når vi skal spille! Vi skal også legge til støtte for å kunne legge til bilder og videoer underveis i runden!"
          />
        </div>
        <section className="flex justify-center items-center w-full mx-4">
          <UpcomingEvent />
        </section>
        <section className="flex flex-col justify-center items-center m-auto text-center gap-4">
          <TextImage
            orientation="text-left"
            heading="Oppdateringer kommer"
            paragraph="Holder på å jobbe med litt småting på nettsiden, det kommer bl.a en måte dere kan se tidligere runder og resultater på, og det kommer til å være mulig å legge til bilder og videoer underveis i runden. For at dere skal kunne gjøre dette så må dere opprette en profil ved å trykke på knappen øverst til høyre, så legger jeg dere til!"
            imageUrl="/enlightened.png"
            textCenter
          />
        </section>

        {/* <section className="flex justify-center items-center w-full text-background bg-foreground p-4 md:p-16">
          <Bubble className="md:text-foreground md:bg-background">
            <TextImage
              orientation="text-left"
              textCenter
              heading="Neste runde starter snart!"
              paragraph="Gjør deg klar for en ny runde med spennende utfordringer og moro. Følg med for oppdateringer og detaljer."
            />
          </Bubble>
        </section>
        <section className="flex justify-center items-center w-full p-4 md:p-16">
          <TextImage
            orientation="text-right"
            textCenter
            heading="Leaderboard"
            paragraph="Se hvem som leder an i Disckos! Hold deg oppdatert på de beste prestasjonene og konkurrer om toppen av listen."
          />
        </section>
        <section className="flex justify-center items-center w-full text-background bg-foreground p-4 md:p-16">
          <TextImage
            orientation="text-left"
            textCenter
            heading="Siste vinner: Mayoo"
            paragraph="Livet er et lære, man må alltid lære."
          />
        </section> */}
        <section className="flex justify-center items-center w-full text-sm text-muted-foreground">
          &copy; 2026 Disckos. Laget med ❤️ av Disckos-teamet.
        </section>
      </main>
    </div>
  );
}
