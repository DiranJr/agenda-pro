"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4 glass-dark" : "py-6 bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-gradient">
                    Agenda<span className="text-accent">Pro</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#services" className="text-sm font-medium hover:text-accent transition-colors">Services</Link>
                    <Link href="#about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
                    <button className="px-6 py-2.5 rounded-full accent-gradient text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-accent/20">
                        Book Now
                    </button>
                </div>

                <button className="md:hidden text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
