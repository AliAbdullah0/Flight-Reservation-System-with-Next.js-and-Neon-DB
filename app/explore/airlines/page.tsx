"use client";

import React, { useState, useEffect } from "react";
import { getTrendingAirlines } from "@/actions/flight.actions";
import { Skeleton } from "@/components/ui/skeleton";

// Update the interface
interface TrendingAirline {
  airline_name: string;
  reservation_count: number;
  airline_code?: string; // Optional if not coming from backend
}

// Placeholder images
const airlineImages = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1518242007689-880e47e7a5e1",
  "https://images.unsplash.com/photo-1503455637927-730d68371fe0",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
  "https://images.unsplash.com/photo-1530549387789-4c1017266634",
];

const Airlines = () => {
  const [airlines, setAirlines] = useState<TrendingAirline[] | null>(null);

  const getData = async () => {
    try {
      const data = await getTrendingAirlines();
      setAirlines(data);
    } catch (error) {
      console.error("Failed to fetch airlines:", error);
    }
  };

  useEffect(() => {
    getData();
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
        <h2 className="font-bold text-white text-xl sm:text-2xl">Explore Airlines</h2>
        <p className="text-neutral-500 mt-1 text-sm sm:text-base">
          Discover top airlines for your next journey
        </p>
      </div>
      <div className="w-full flex flex-col gap-3">
        {airlines ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {airlines.map((airline, index) => (
              <div
                key={index}
                className="w-full border-none min-w-0 h-60 sm:h-64 rounded-2xl bg-cover bg-center relative overflow-hidden border border-white/20 hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: `url(${airlineImages[index % airlineImages.length]})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold text-white/90">
                    {airline.airline_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70">
                    Reservations: {airline.reservation_count}
                  </p>
                  {airline.airline_code && (
                    <p className="text-xs sm:text-sm text-white/50">
                      Code: {airline.airline_code}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderSkeletonCards()
        )}
      </div>
    </div>
  );
};

export default Airlines;
