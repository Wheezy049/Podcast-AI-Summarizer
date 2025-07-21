"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 bg-[#FFF] p-5 md:py-5 lg:px-14 md:px-5 gap-12 ${
        scrolled ? "bg-[#fff] shadow-lg" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-semibold cursor-pointer">AI SUMMARIZER</h1>
        </Link>
      <div className="hidden md:flex justify-between items-center gap-3 lg:gap-12 lg:text-lg md:text-sm">
        <Link
          href="/"
          className={`hover:text-[#F97316] ${
            pathname === "/" ? "text-[#F97316]" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/"
          className={`hover:text-[#F97316] ${
            pathname === "/pricing" ? "text-[#F97316]" : ""
          }`}
        >
          Pricing
        </Link>
        <Link
          href="/"
          className={`flex items-center hover:text-[#F97316] ${
            pathname === "/tools" ? "text-[#F97316]" : ""
          }`}
        >
          Tools
        </Link>
        
        <Link
          href="#"
          className={`hover:text-[#F97316] ${
            pathname === "/about" ? "text-[#F97316]" : ""
          }`}
        >
          About
        </Link>
      </div>

      {/* Should be replaced with proper button components */}
      <div className="hidden md:flex md:gap-2 lg:gap-5 lg:text-lg md:text-sm">
        <Link
          href="/"
          className="md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-[32px] bg-[#F4F4F5] text-[#1A1A1A]"
        >
          Login
        </Link>
        <Link
          href="/"
          className="md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-[32px] bg-[#F97316] text-white hover:bg-[#F97316]/80"
        >
          Get started
        </Link>
      </div>
      </div>
    </div>
  );
}

export default Navbar;
