"use server"

import sql from "@/lib/neon"
import { cookies } from "next/headers";
import { Resend } from 'resend'
import { getCurrentUser } from "./user.actions";
const resend = new Resend(process.env.RESEND_API_KEY!)

export const sendEmail = async (price:number,email:string,airline:string,country:string,airport:string)=>{
    try {
        const response = resend.emails.send({
            from: 'AirWhite | Flight Reservation System <onboarding@resend.dev>',
            to:email,
            subject: 'Flight Book Confirmation',
            text: `You have booked a flight to ${airport} from ${country} with ${airline} for PKR ${price} `,    
        })

        return {
            success:200,
            message:"Email Sent Successfully"
        }
    } catch (error) {
        throw error
    }
}

export const getAirports = async () => {
    try {
        const airports = await sql`
            SELECT * FROM airports
        ` as Airport[]

        if (airports.length === 0) {
            throw new Error("No airports found");
        }

        return airports;
    } catch (error) {
        throw error
    }
}

export const getAirLines = async () => {
    try {
        const airlines = await sql`
            SELECT * FROM airlines
        ` as Airline[]
        if (airlines.length === 0) {
            throw new Error("No airlines found");
        }
        return airlines;
    } catch (error) {
        throw error
    }
}

export const makeReservation = async (formData:FormData)=>{
    const cookie = await cookies()
    const userId = cookie.get('auth_token')?.value 
    const user = await getCurrentUser() as User
    if(!userId || !user) {
        throw new Error("Please Log In To Make reservations")
    }
    const airport_name = formData.get("airport_name") as string;
    const arrival_airport = formData.get("arrival_airport") as string | null;
    const departure_date = formData.get("departure_date") as Date | null;
    const country = formData.get('country') as string ;
    const airline = formData.get("airline") as string;
    const price = formData.get("price") as number | null;
    const generatePrice = Math.floor(Math.random() * 1000000) + 1;

    try {
        const response = await sql`
            INSERT INTO reservations (airport_name, arrival_airport, departure_date, country, airline, user_id,price)
            VALUES (${airport_name}, ${arrival_airport}, ${departure_date}, ${country}, ${airline}, ${userId}, ${generatePrice})
        ` as Reservation[];

        await sendEmail(generatePrice,user.email,airline,country,airport_name)

        return {
            success:true,
            status:201,
            message:"Reservation Created Successfully"
        }
    } catch (error) {
        throw error
    }
}

export const getReservations = async ()=>{
    try {
        const reservations = await sql`
            SELECT * FROM reservations
        ` as Reservation[]
        if (reservations.length === 0) {
            throw new Error("No reservations found");
        }
        return reservations;
    } catch (error) {
        throw error
    }
}

export const getTrendingAirlines = async () => {
    try {
      const airlines = await sql`
        SELECT airlines.airline_name, 
        COUNT(reservations.reservation_id) AS reservation_count
        FROM airlines
        LEFT JOIN reservations ON reservations.airline = airlines.airline_name
        GROUP BY airlines.airline_name
        ORDER BY reservation_count DESC
      ` as { airline_name: string; reservation_count: number }[];
  
  
      if (airlines.length === 0) {
        throw new Error("No airlines found");
      }
  
      return airlines;
    } catch (error) {
      throw error;
    }
  };

export const deleteReservation = async (reservationId: number) => {
    try {
      await sql`
        DELETE FROM reservations WHERE reservation_id = ${reservationId}
      `;
  
      return {
        success: true,
        status: 200,
        message: "Reservation deleted successfully"
      };
    } catch (error) {
      throw error;
    }
};

export const getFlights = async ()=>{
    try {
        const flights = await sql`
            SELECT * FROM flights
        ` as Flight[]

        return flights;
    } catch (error) {
        throw error;
    }
}

export const reserveFlight = async (flight_id: number) => {
    try {
        const cookie = await cookies();
        const userId = cookie.get("auth_token")?.value;
        const user = await getCurrentUser() as User;

        if (!userId || !user) {
            throw new Error("Please log in to reserve a flight.");
        }

        const [flight] = await sql`
            SELECT * FROM flights WHERE flight_id = ${flight_id}
        ` as Flight[];

        if (!flight) {
            throw new Error("Flight not found.");
        }

        await sql`
            INSERT INTO reservations (
                airport_name,
                arrival_airport,
                departure_date,
                country,
                airline,
                user_id,
                price
            ) VALUES (
                ${flight.flight_airport},
                ${flight.arrival_airport},
                ${flight.departure_date},
                ${flight.country},
                ${flight.airline},
                ${user.user_id},
                ${flight.price}
            )
        `;

        await sendEmail(flight.price, user.email, flight.airline, flight.country, flight.flight_airport);

        return {
            success: true,
            status: 201,
            message: "Flight reserved successfully",
        };
    } catch (error) {
        console.error("Error reserving flight:", error);
        throw error;
    }
};