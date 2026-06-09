import GameBoard from '@/components/game/GameBoard'

export default async function PlayPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode = 'CLASSIC' } = await searchParams
  const normalizedMode = mode.toUpperCase() as 'CLASSIC' | 'SURVIVAL' | 'TIMED'

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-900/10 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
      </div>

      <div className="z-10 w-full max-w-5xl">
        <GameBoard mode={normalizedMode} />
      </div>
    </div>
  )
}
