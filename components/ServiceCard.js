export default function ServiceCard({ title, description, price, duration, icon }) {
    return (
        <div className="group relative p-8 rounded-3xl glass transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

            <div className="relative z-10">
                <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-accent/20 text-accent group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>

                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                        <span className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Starts from</span>
                        <span className="text-xl font-bold">${price}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Duration</span>
                        <span className="text-sm font-medium text-zinc-300">{duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
