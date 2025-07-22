"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <h1 className=" text-2xl sm:text-3xl md:text-4xl font-semibold cursor-pointer">
            AI SUMMARIZER
          </h1>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex justify-between items-center gap-3 lg:gap-12 lg:text-lg md:text-sm">
          <Link
            href="/"
            className={`hover:text-[#F97316] ${
              pathname === "/" ? "text-[#F97316]" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={`hover:text-[#F97316] ${
              pathname === "/pricing" ? "text-[#F97316]" : ""
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/tools"
            className={`flex items-center hover:text-[#F97316] ${
              pathname === "/tools" ? "text-[#F97316]" : ""
            }`}
          >
            Tools
          </Link>
          <Link
            href="/about"
            className={`hover:text-[#F97316] ${
              pathname === "/about" ? "text-[#F97316]" : ""
            }`}
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex md:gap-2 lg:gap-5 lg:text-lg md:text-sm">
          <Link
            href="/login"
            className="md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-[32px] bg-[#F4F4F5] text-[#1A1A1A]"
          >
            Login
          </Link>
          <Link
            href="/get-started"
            className="md:py-2 md:px-4 lg:py-3 lg:px-6 rounded-[32px] bg-[#F97316] text-white hover:bg-[#F97316]/80"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden mt-4 space-y-4 px-5">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block text-lg hover:text-[#F97316] ${
              pathname === "/" ? "text-[#F97316]" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMenuOpen(false)}
            className={`block text-lg hover:text-[#F97316] ${
              pathname === "/pricing" ? "text-[#F97316]" : ""
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/tools"
            onClick={() => setIsMenuOpen(false)}
            className={`block text-lg hover:text-[#F97316] ${
              pathname === "/tools" ? "text-[#F97316]" : ""
            }`}
          >
            Tools
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`block text-lg hover:text-[#F97316] ${
              pathname === "/about" ? "text-[#F97316]" : ""
            }`}
          >
            About
          </Link>

          <div className="flex flex-col gap-3 mt-6">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 px-4 rounded-[32px] bg-[#F4F4F5] text-center text-[#1A1A1A]"
            >
              Login
            </Link>
            <Link
              href="/get-started"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 px-4 rounded-[32px] bg-[#F97316] text-center text-white hover:bg-[#F97316]/80"
            >
              Get started
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}

export default Navbar;
