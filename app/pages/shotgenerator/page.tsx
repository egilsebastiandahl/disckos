import HeaderSection from "@/app/components/sections/HeaderSection";

const ShotgeneratorPage = () => {
  return (
    <>
      <HeaderSection title="Shot-generator" text="Her kan du rulle om hvilket kast du skal bruke!" />
      <main>
        <section>Denne skal implementeres etterhvert</section>

        <p>Disc:</p>
        <ul>
          <li>Putter</li>
          <li>Midrange</li>
          <li>Fairway</li>
          <li>Driver</li>
        </ul>
        <p>Stabilitet:</p>
        <ul>
          <li>Overstabil</li>
          <li>Stabil</li>
          <li>Understabil</li>
        </ul>
        <p>Vinkel:</p>
        <ul>
          <li>Hyzer</li>
          <li>Anhyzer</li>
          <li>Flex</li>
          <li>Rett-fram</li>
        </ul>
        <p>Kastemåte:</p>
        <ul>
          <li>Backhand</li>
          <li>Forehand</li>
          <li>Tomahawk</li>
          <li>Granat</li>
          <li>Roller</li>
          <li>Opp ned</li>
          <li>Kamerat velger</li>
          <li>Konkurrent velger</li>
        </ul>
        <p>Ekstra:</p>
        <ul>
          <li>Venstre hånd</li>
          <li>Høyre hånd</li>
          <li>360 spin</li>
          <li>Blindt</li>
          <li>Gå for kurven, ikke legg opp</li>
        </ul>
      </main>
    </>
  );
};

export default ShotgeneratorPage;
