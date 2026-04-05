import HeaderSection from "@/app/components/sections/HeaderSection";

const ResultsPage = () => {
  return (
    <>
      <HeaderSection title="Resultater" text="Her er resultatene fra de siste spilte kampene!" />
      <main className="flex justify-center items-center w-full p-4 md:p-16">
        <p>Her vil fremtidige resultater dukke opp etterhvert som eventene blir ferdige.</p>
      </main>
    </>
  );
};

export default ResultsPage;
