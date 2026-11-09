import HeaderSection from "@/app/components/sections/HeaderSection";
import LocationsWeatherList from "./components/LocationsWeatherList";

const LokasjonerPage = () => {
  return (
    <>
      <HeaderSection
        title="Baner"
        text="Her er hvor det er best å spille i dag!"
      />
      <div className="flex max-w-7xl mx-auto sm:px-6 lg:px-8 justify-center">
        <LocationsWeatherList />
      </div>
    </>
  );
};

export default LokasjonerPage;
