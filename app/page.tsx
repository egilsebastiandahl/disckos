import HeaderSection from "./components/sections/HeaderSection";
import UpcomingEvent from "./components/sections/UpcomingEvent";

export default function Home() {
  return (
    <div className="flex justify-center font-sans">
      <main className="flex w-full flex-col items-center justify-between pt-32 sm:items-start gap-4 md:gap-8">
        <div className="flex w-full justify-center items-center px-4 md:px-0">
          <HeaderSection title="Velkommen til Disckos" text="Her kan du følge med på hva som skjer i Disckos." />
        </div>
        <section className="flex justify-center items-center w-full p-4 md:p-16">
          <UpcomingEvent />
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
      </main>
    </div>
  );
}
