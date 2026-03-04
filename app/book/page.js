export default function BookPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center">
            <div className="max-w-xl space-y-4">
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Reserva</h1>
                <p className="text-zinc-600">
                    Esta rota foi mantida apenas como fallback. O fluxo principal de agendamento esta em
                    <span className="font-bold"> /[slug] </span>.
                </p>
            </div>
        </div>
    );
}
