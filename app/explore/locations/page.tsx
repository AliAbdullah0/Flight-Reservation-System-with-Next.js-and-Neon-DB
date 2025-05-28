"use client"
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Location {
  country: string;
  city: string;
  airport: string;
  image: string;
}

const locations: Location[] = [
  {
    country: "United States",
    city: "New York",
    airport: "John F. Kennedy International Airport (JFK)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    country: "Canada",
    city: "Toronto",
    airport: "Toronto Pearson International Airport (YYZ)",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  },
  {
    country: "United Kingdom",
    city: "London",
    airport: "Heathrow Airport (LHR)",
    image: "https://images.unsplash.com/photo-1521747116042-5a81077343f2",
  },
  {
    country: "France",
    city: "Paris",
    airport: "Charles de Gaulle Airport (CDG)",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    country: "Germany",
    city: "Berlin",
    airport: "Berlin Brandenburg Airport (BER)",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047",
  },
  {
    country: "Japan",
    city: "Tokyo",
    airport: "Narita International Airport (NRT)",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
  {
    country: "Australia",
    city: "Sydney",
    airport: "Sydney Kingsford Smith Airport (SYD)",
    image: "https://images.unsplash.com/photo-1528072164453-f4e8b0e7b3c8",
  },
  {
    country: "Pakistan",
    city: "Karachi",
    airport: "Jinnah International Airport (KHI)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    country: "Brazil",
    city: "São Paulo",
    airport: "São Paulo-Guarulhos International Airport (GRU)",
    image: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f",
  },
];

const Locations = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderSkeletonCards = () => (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-60 sm:h-64 rounded-2xl bg-white/5 border border-white/10"
        />
      ))}
    </div>
  );

  return (
    <div className="flex w-full flex-col min-h-screen p-2 sm:p-4 max-w-screen-xl mx-auto">
      <div className="w-full p-4 sm:p-5">
        <h2 className="font-bold text-white text-xl sm:text-2xl">Explore Locations</h2>
        <p className="text-neutral-500 mt-1 text-sm sm:text-base">
          Discover top destinations and airports worldwide
        </p>
      </div>
      <div className="w-full flex flex-col gap-3">
        {isLoading ? (
          renderSkeletonCards()
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location, index) => (
              <div
                key={index}
                className="w-full border-none min-w-0 h-60 sm:h-64 rounded-2xl bg-cover bg-center relative overflow-hidden border border-white/20 hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${location.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold text-white/90">{location.country}</h3>
                  <p className="text-sm sm:text-base text-white/70">{location.city}</p>
                  <p className="text-xs sm:text-sm text-white/70">{location.airport}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;