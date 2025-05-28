interface User {
    user_id: number;
    username: string;
    phone_number: number;
    email: string;
    password: string;
    cardnumber: number;
}

interface Airport {
    airport_id: number;
    airport_code: string;
    airport_name: string;
    city: string;
    country: string;
}   

interface Airline {
    airline_id: number;
    airline_name: string;
    airline_code:string;
}

interface Reservation {
    reservation_id: number;
    airport_name: string;
    arrival_airport: string;
    departure_date: Date;
    country: string;
    airline: string;
    reservation_date:Date;
    user:User;
}