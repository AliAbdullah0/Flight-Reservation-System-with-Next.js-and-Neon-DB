"use server";

import bcrypt from 'bcryptjs';
import sql from "@/lib/neon";
import { cookies } from 'next/headers';


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
      httpOnly: true,
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