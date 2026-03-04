export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Agenda Pro</h1>
      <p className="text-lg text-zinc-600 mb-8">Base do projeto inicializada com sucesso.</p>
      <div className="flex gap-4">
        <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium">Next.js 15 (App Router)</span>
        <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium">JavaScript</span>
        <span className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium">Tailwind CSS</span>
      </div>
    </div>
  );
}
