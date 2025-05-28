import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import { UserProvider } from "../context/userContext";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
});
export const metadata: Metadata = {
  title: "AirWhite",
  description: "Flight Reservation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${monaSans.className} bg-black antialiased`}
        >
        <UserProvider>
        <Header/>
        {children}
        <Toaster position="bottom-right"/>
      </UserProvider>
      </body>
    </html>
  );
}
