"use server";

import bcrypt from 'bcryptjs';
import sql from "@/lib/neon";
import { cookies } from 'next/headers';

type CurrentUserResponse = {
  user_id: number;
  username: string;
  phone_number: number;
  email: string;
  cardnumber: number;
  reservations: Reservation[];
} | null;



export const createUser = async (formData: FormData) => {
  const username = formData.get("username") as string | null;
  const phone_number = formData.get("phone_number") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const cardnumber = formData.get("cardnumber") as string | null;

  if (!username || !phone_number || !email || !password || !cardnumber) {
    throw new Error("Missing required fields.");
  }

  try {
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (username, phone_number, email, password, cardnumber)
      VALUES (${username}, ${parseInt(phone_number)}, ${email}, ${hashedPassword}, ${parseInt(cardnumber)})
    `;

    return {
      success: true,
      status: 201,
      message: "User Created Successfully"
    };
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (formData: FormData) => {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  if (!email || !password) {
    throw new Error("Missing email or password.");
  }

  try {
    const existingUser = (
      await sql`SELECT * FROM users WHERE email = ${email}`
    )[0] as User;
    if (!existingUser) {
      throw new Error("User does not exist!");
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      throw new Error("Password is incorrect!");
    }
    const cookie = await cookies()
    const token = cookie.set('auth_token',existingUser.user_id.toString(),{
      maxAge:7 * 3600 * 24,
      httpOnly:true,
      secure:false,
      sameSite: "lax",
    })

    return {
      success: true,
      status: 200,
      message: "User Signed In Successfully"
    };
  } catch (error) {
    throw error;
  }
};


export const getCurrentUser = async () => {
    try {
      const cookie = await cookies();
      const token = cookie.get('auth_token');
      const userId = token?.value;
        
      if (!userId) {
        return null;
      }
  
      const user = await sql`
        SELECT * FROM users WHERE user_id = ${userId}
      `;
        
      if (!user || user.length === 0) {
        return null; 
      }
  
      return user[0]; 
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null; 
    }
  };

export const signOutUser = async () => {
    try {
      const cookie = await cookies()
      cookie.delete('auth_token')
      return {
        success: true,
        status: 200,
        message: "User Signed Out Successfully"
      };
    } catch (error) {
      throw error;
    }
};

export const getCurrentUserWithReservations = async (): Promise<CurrentUserResponse> => {
  try {
    const cookie = await cookies();
    const token = cookie.get('auth_token');
    const userId = token?.value;

    if (!userId) {
      return null;
    }

    const result = await sql`
      SELECT 
        u.user_id,
        u.username,
        u.phone_number,
        u.email,
        u.cardnumber,
        json_agg(
          json_build_object(
            'reservation_id', r.reservation_id,
            'user_id', r.user_id,
            'airport_name', r.airport_name,
            'arrival_airport', r.arrival_airport,
            'departure_date', r.departure_date,
            'country', r.country,
            'airline', r.airline,
            'reservation_date', r.reservation_date
          )
        ) as reservations
      FROM users u
      LEFT JOIN reservations r ON u.user_id = r.user_id
      WHERE u.user_id = ${userId}
      GROUP BY u.user_id, u.username, u.phone_number, u.email, u.cardnumber
    `;

    if (!result || result.length === 0) {
      return null;
    }

    const user = result[0];
    const reservations = user.reservations && user.reservations[0]?.reservation_id ? user.reservations : [];
    
    return {
      user_id: user.user_id,
      username: user.username,
      phone_number: user.phone_number,
      email: user.email,
      cardnumber: user.cardnumber,
      reservations,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

export const updateUsernameAndCard = async (formData: FormData) => {
  const username = formData.get("username") as string | null;
  const cardnumber = formData.get("cardnumber") as string | null;

  if (!username || !cardnumber) {
    throw new Error("Missing required fields.");
  }

  try {
    const cookie = await cookies();
    const token = cookie.get("auth_token");
    const userId = token?.value;

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    await sql`
      UPDATE users
      SET username = ${username}, cardnumber = ${parseInt(cardnumber)}
      WHERE user_id = ${userId}
    `;

    return {
      success: true,
      status: 200,
      message: "Username and Card Number updated successfully.",
    };
  } catch (error) {
    console.error("Error updating username and card number:", error);
    throw error;
  }
};