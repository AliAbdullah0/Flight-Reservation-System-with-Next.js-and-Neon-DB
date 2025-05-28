import React from "react";
import InfoCard from "./InfoCard";

const Feature = () => {
  const flightContent = (
    <div className="flex gap-3 w-full">
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> PK-445
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> TR-340
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> LI-110
        </li>
      </ul>
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> PK-100
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> MZ-460
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> SD-230
        </li>
      </ul>
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> PK-445
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> TR-340
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> LI-110
        </li>
      </ul>
    </div>
  );

  const airportContent = (
    <div className="flex gap-3 md:justify-evenly w-full">
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> Jinnah Intl (KHI)
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Islamabad Intl (ISB)
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Allama Iqbal Intl (LHE)
        </li>
      </ul>
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> Bacha Khan Intl (PEW)
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Sialkot Intl (SKT)
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Multan Intl (MUX)
        </li>
      </ul>
    </div>
  );

  const cityContent = (
    <div className="flex gap-3 md:justify-evenly w-full">
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> Karachi
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Islamabad
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Lahore
        </li>
      </ul>
      <ul>
        <li>
          <span className="text-white/20 font-bold">|</span> Peshawar
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Quetta
        </li>
        <li>
          <span className="text-white/20 font-bold">|</span> Faisalabad
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex w-full md:flex-row flex-col justify-evenly md:p-20 p-2 mt-8">
      <InfoCard title="Flights" content={flightContent} />
      <InfoCard title="Airports" content={airportContent} />
      <InfoCard title="Cities" content={cityContent} withBorder={false} />
    </div>
  );
};

export default Feature;
