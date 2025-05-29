"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plane } from "lucide-react";
import { getFlights, reserveFlight } from "@/actions/flight.actions";

const Flights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await getFlights();
        setFlights(data);
      } catch (error) {
        toast.error("Failed to load flights");
      }
    };

    fetchFlights();
  }, []);

  const handleReserve = (flight_id: number) => {
    startTransition(async () => {
      try {
        const res = await reserveFlight(flight_id);
        toast.success(res.message);
      } catch (error) {
        toast.error("Reservation failed");
      }
    });
  };

  const filteredFlights = flights.filter(
    (flight) =>
      flight.arrival_airport.toLowerCase().includes(search.toLowerCase()) ||
      flight.flight_airport.toLowerCase().includes(search.toLowerCase()) ||
      flight.country.toLowerCase().includes(search.toLowerCase()) ||
      flight.airline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-black to-neutral-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upcoming Flights</h1>

        <Input
          placeholder="Search by airport, country, airline..."
          className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur placeholder:text-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {filteredFlights.map((flight) => (
            <Card
              key={flight.flight_id}
              className="bg-white/10 text-white border border-white/10 backdrop-blur-xl shadow-md rounded-2xl hover:scale-[1.01] transition-transform"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    {flight.flight_airport} ➝ {flight.arrival_airport}
                  </div>
                  <Plane className="w-5 h-5" />
                </div>
                <div className="text-sm text-gray-300">
                  Airline: {flight.airline}<br />
                  Country: {flight.country}<br />
                  Date: {new Date(flight.departure_date).toLocaleDateString()}<br />
                  Price: PKR {flight.price.toLocaleString()}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      ) : (
                        "Reserve"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/10 text-white border-white/20 backdrop-blur-xl">
                    <DialogTitle className="sr-only">Confirm Reservation</DialogTitle>
                    <p className="text-center">Confirm reservation for {flight.airline}?</p>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => handleReserve(flight.flight_id)}
                      disabled={isPending}
                    >
                      {isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Confirm"}
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flights;
