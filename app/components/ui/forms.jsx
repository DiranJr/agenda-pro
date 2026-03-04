import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, actions, className = "" }) {
    return (
        <div className={cn("flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12", className)}>
            <div>
                <h1 className="text-4xl font-black tracking-tight text-zinc-900">{title}</h1>
                {subtitle && <p className="text-zinc-500 font-medium text-lg mt-2">{subtitle}</p>}
            </div>
            <div className="flex gap-3 items-center">{actions}</div>
        </div>
    );
}

export function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-zinc-100 text-zinc-600 border-zinc-200",
        success: "bg-green-50 text-green-700 border-green-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-red-50 text-red-700 border-red-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    };

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

export function Input({ label, error, className = "", ...props }) {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 block">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none transition-all focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 placeholder:text-zinc-300",
                    error && "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-600/5",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
        </div>
    );
}
