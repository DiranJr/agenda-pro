"use client";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                className: 'font-bold rounded-2xl border border-zinc-100 shadow-2xl',
                duration: 4000,
                style: {
                    borderRadius: '1.25rem',
                    background: '#fff',
                    color: '#18181b',
                    fontSize: '14px',
                    padding: '16px 24px',
                },
                success: {
                    iconTheme: {
                        primary: '#4f46e5',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
