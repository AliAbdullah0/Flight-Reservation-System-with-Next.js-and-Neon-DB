"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAirports, getAirLines, makeReservation } from "@/actions/flight.actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useUser } from "@/context/userContext";


const reservationSchema = z.object({
  airport_code: z.string().min(1, "Departure airport is required"),
  arrival_airport: z.string().min(1, "Arrival airport is required"),
  departure_date: z.string().min(1, "Departure date is required"),
  country: z.string().min(1, "Country is required"),
  airline_code: z.string().min(1, "Airline is required"),
});

type ReservationForm = z.infer<typeof reservationSchema>;

const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "AU", name: "Australia" },
  { code: "PK", name: "Pakistan" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
];

const Reservation = () => {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [airports, setAirports] = useState<Airport[] | null>(null);
  const [airlines, setAirlines] = useState<Airline[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCountryValid, setIsCountryValid] = useState(true);

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      airport_code: "",
      arrival_airport: "",
      departure_date: "",
      country: "",
      airline_code: "",
    },
  });

  const getData = useCallback(async () => {
    try {
      const airports = await getAirports();
      const airlines = await getAirLines();
      setAirports(airports);
      setAirlines(airlines);
    } catch (error) {
      toast.error("Failed to fetch airports or airlines", { style: { background: "#1F2937", color: "#F87171" } });
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const onSubmit = useCallback(
    async (data: ReservationForm) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("airport_name", data.airport_code);
        formData.append("arrival_airport", data.arrival_airport);
        formData.append("departure_date", data.departure_date);
        formData.append("country", data.country);
        formData.append("airline", data.airline_code);

        const response = await makeReservation(formData);
        toast.success(response.message);
        form.reset();
        setSelectedAirport(null);
        setSelectedAirline(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create reservation");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, isSubmitting]
  );

  const memoizedAirports = useMemo(() => airports || [], [airports]);
  const memoizedAirlines = useMemo(() => airlines || [], [airlines]);

  const validateCountry = useCallback(
    (countryName: string) => {
      if (!countryName || !memoizedAirports.length) return false;
      const isValid = memoizedAirports.some((airport) => airport.country === countryName);
      if (!isValid) {
        toast.warning(`No flights available to ${countryName}`);
      }
      setIsCountryValid(isValid);
      return isValid;
    },
    [memoizedAirports]
  );

  const renderSkeletonCards = () => (
    <div className="w-full flex justify-evenly flex-wrap gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-[30%] h-24 rounded-2xl bg-white/5 border border-white/10"
        />
      ))}
    </div>
  );

  return (
    <div className="flex w-full flex-col min-h-screen md:p-4 p-2">
      <div className="w-full p-5">
        <h2 className="font-bold text-white text-2xl">Make A Reservation</h2>
        <p className="text-neutral-500 md:text-base text-sm mt-1"><span className="text-neutral-400 ">AirWhite</span> Flight Reservation System</p>
      </div>
      <div className="w-full flex flex-col gap-3 md:ml-8">
        <h3 className="font-bold text-white/80 text-2xl">Available Airports</h3>
        {memoizedAirports.length > 0 ? (
          <div className="w-full flex flex-wrap gap-4">
            {memoizedAirports.map((airport) => (
              <div
                key={airport.airport_id}
                onClick={() => {
                  setSelectedAirport(airport);
                  form.setValue("airport_code", airport.airport_code);
                }}
                className={`md:w-[30%] w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border cursor-pointer ${
                  selectedAirport?.airport_id === airport.airport_id
                    ? "bg-blue-600/30 border-blue-500 shadow-md"
                    : "border-white/20"
                }`}
              >
                <h3 className="text-xl font-bold text-white">{airport.airport_name}</h3>
                <p className="text-white/70">{airport.city}, {airport.country}</p>
                <p className="text-white/50">Code: {airport.airport_code}</p>
              </div>
            ))}
          </div>
        ) : (
          renderSkeletonCards()
        )}
      </div>
      <div className="w-full flex mt-6 md:ml-8 flex-col gap-3">
        <h3 className="font-bold text-white/80 text-2xl">Available Airlines</h3>
        {memoizedAirlines.length > 0 ? (
          <div className="w-full flex gap-4 flex-wrap">
            {memoizedAirlines.map((airline) => (
              <div
                key={airline.airline_id}
                onClick={() => {
                  setSelectedAirline(airline);
                  form.setValue("airline_code", airline.airline_name);
                }}
                className={`md:w-[30%] w-full p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border cursor-pointer ${
                  selectedAirline?.airline_id === airline.airline_id
                    ? "bg-blue-600/30 border-blue-500 shadow-md"
                    : "border-white/20"
                }`}
              >
                <h3 className="text-xl font-bold text-white">{airline.airline_name}</h3>
                <p className="text-white/50">Code: {airline.airline_code}</p>
              </div>
            ))}
          </div>
        ) : (
          renderSkeletonCards()
        )}
      </div>
      <div className="mt-10 md:ml-8 flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:p-6 p-3 space-y-6 bg-white/10 rounded-2xl border border-white/20"
          >
            <FormField
              control={form.control}
              name="arrival_airport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Arrival Airport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black text-white border-white/20">
                        <SelectValue placeholder="Select arrival airport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black text-white border-white/20">
                      {memoizedAirports.map((airport) => (
                        <SelectItem key={airport.airport_id} value={airport.airport_code}>
                          {`${airport.airport_name} (${airport.airport_code})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departure_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal bg-black text-white border-white/20 hover:bg-white/20 ${
                            !field.value ? "text-white/50" : ""
                          }`}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="bg-black text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      validateCountry(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black text-white border-white/20">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black text-white border-white/20">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-black rounded-lg"
              disabled={isSubmitting || !isCountryValid}
            >
              {isSubmitting ? (
                <p className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing
                </p>
              ) : (
                "Create Reservation"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Reservation;