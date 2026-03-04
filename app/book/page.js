"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const services = [
    { id: 1, name: "Premium Consultation", price: 120, duration: "60 min" },
    { id: 2, name: "Design Sprint", price: 450, duration: "4 hours" },
    { id: 3, name: "Tech Audit", price: 200, duration: "90 min" },
];

const timeSlots = [
    "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"
];

export default function BookPage() {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        service: null,
        date: "",
        time: "",
        name: "",
        email: "",
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleServiceSelect = (service) => {
        setBookingData({ ...bookingData, service });
        nextStep();
    };

    const handleDateTimeSelect = (date, time) => {
        setBookingData({ ...bookingData, date, time });
        nextStep();
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <Navbar />

            <div className="container mx-auto max-w-3xl">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-12 px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? "accent-gradient text-white shadow-lg shadow-accent/20" : "glass text-zinc-500"
                                }`}>
                                {s}
                            </div>
                            <span className={`hidden sm:block text-xs font-bold uppercase tracking-widest ${step >= s ? "text-white" : "text-zinc-500"
                                }`}>
                                {s === 1 ? "Service" : s === 2 ? "Time" : "Details"}
                            </span>
                            {s < 3 && <div className={`w-12 h-[1px] ${step > s ? "bg-accent" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="step1"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-gradient">Select a Service</h2>
                            <div className="grid gap-4">
                                {services.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleServiceSelect(s)}
                                        className="p-6 rounded-2xl glass text-left hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{s.name}</h3>
                                            <p className="text-zinc-500 text-sm">{s.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xl font-black text-accent">${s.price}</span>
                                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 group-hover:text-accent transition-colors">Select</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="step2"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gradient">Choose Time</h2>
                                <button onClick={prevStep} className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                    Back
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleDateTimeSelect("2026-03-10", time)}
                                        className="p-4 rounded-xl glass font-bold hover:bg-accent/20 hover:border-accent/40 transition-all"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key="step3"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gradient">Your Details</h2>
                                <button onClick={prevStep} className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                    Back
                                </button>
                            </div>

                            <div className="p-8 rounded-3xl glass space-y-6">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent transition-colors"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-accent transition-colors"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button className="w-full py-5 rounded-2xl accent-gradient font-black text-lg shadow-2xl shadow-accent/40 hover:scale-[1.01] transition-transform">
                                        Confirm Booking
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
