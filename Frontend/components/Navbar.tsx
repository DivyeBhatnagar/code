"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <Image src="/logo.png" alt="CodePilot AI" width={170} height={170} className="object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#showcase" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Showcase
            </a>
            <a href="#about" className="text-sm text-gray-600 hover:text-primary transition-colors">
              About
            </a>
            <Link href="/login">
              <button className="text-sm text-gray-600 hover:text-primary transition-colors mr-4">
                Login
              </button>
            </Link>
          </div>

          <Link href="/register">
            <button className="px-5 py-2 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent/90 transition-all hover:scale-105">
              Launch App
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
