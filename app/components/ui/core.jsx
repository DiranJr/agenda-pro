import { cn } from "@/lib/utils";

export function Button({
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    children,
    ...props
}) {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100",
        secondary: "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50",
        outline: "bg-transparent text-zinc-700 border border-zinc-200 hover:border-zinc-300",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white",
        ghost: "bg-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <button
            disabled={loading || props.disabled}
            className={cn(
                "inline-flex items-center justify-center rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
}

export function Card({ className = "", children, padding = "p-8" }) {
    return (
        <div className={cn(
            "bg-white border border-zinc-200 rounded-[2rem] shadow-sm",
            padding,
            className
        )}>
            {children}
        </div>
    );
}
