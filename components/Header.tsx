"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/context/userContext";
import { signOutUser } from "@/actions/user.actions";
import { useRouter } from "next/navigation";

interface ClientSideMobileMenuProps {
  initials: string;
  isLoading: boolean;
  user: User | null; 
  handleSignOut: () => Promise <void>;
}

export default function Header() {
  const user = useUser(); 
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const initials: string = user.user?.username
    ? user.user.username
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOutUser();
      router.push("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="bg-black border-b border-b-white/20 border-dotted text-white shadow-sm w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Airwhite
          </Link>
        </div>

  
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-6">
          <Link
            href="/"
            className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
          >
            Explore
          </Link>
          <Link
            href="/flights"
            className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
          >
            Flights
          </Link>
          <Link
            href="/profile"
            className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
          >
            Profile
          </Link>
        </nav>

        <div className="hidden md:flex items-center relative">
          {user.user ? (
            <div
              className="relative"
              onClick={() => setIsDropdownOpen((prev)=>!prev)}
            >
              <Avatar className="h-10 w-10 border-none cursor-pointer">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback className="bg-white text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-white/20 text-neutral-400 rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-white/10 text-neutral-100 rounded-full px-4 py-2">
                Login
              </Button>
            </Link>
          )}
        </div>
        <ClientSideMobileMenu
          initials={initials}
          isLoading={false}
          user={user.user}
          handleSignOut={handleSignOut}
        />
      </div>
    </header>
  );
}

function ClientSideMobileMenu({
  initials,
  isLoading,
  user,
  handleSignOut,
}: ClientSideMobileMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu />}
      </Button>

      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Airwhite
            </Link>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/flights"
              className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Flights
            </Link>
            <Link
              href="/profile"
              className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            {isLoading ? (
              <div className="h-10 w-10 ml-4 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User avatar" />
                  <AvatarFallback className="bg-white text-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleSignOut}
                  className="text-neutral-100 text-sm transition px-3 py-2 rounded-full hover:bg-white/10 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="w-full ml-2">
                <Button className="bg-white/10 text-neutral-100 rounded-full px-4 py-2 w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}