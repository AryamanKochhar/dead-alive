import { getLeaderboard } from '@/app/actions/leaderboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Crown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const revalidate = 0 // always fetch fresh

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode = 'CLASSIC' } = await searchParams
  const normalizedMode = mode.toUpperCase()
  const res = await getLeaderboard(normalizedMode)
  const leaderboard = res.success ? res.data : []

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
      </div>

      <div className="z-10 w-full max-w-4xl space-y-8 pt-12">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600">
            GLOBAL LEADERBOARD
          </h1>
          <p className="text-neutral-400">The most legendary history buffs in the world.</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/leaderboard?mode=CLASSIC">
            <Button variant={normalizedMode === 'CLASSIC' ? 'default' : 'outline'} className={`rounded-full px-6 ${normalizedMode === 'CLASSIC' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-neutral-800'}`}>Classic</Button>
          </Link>
          <Link href="/leaderboard?mode=TIMED">
            <Button variant={normalizedMode === 'TIMED' ? 'default' : 'outline'} className={`rounded-full px-6 ${normalizedMode === 'TIMED' ? 'bg-blue-600 hover:bg-blue-700' : 'border-neutral-800'}`}>Timed</Button>
          </Link>
          <Link href="/leaderboard?mode=SURVIVAL">
            <Button variant={normalizedMode === 'SURVIVAL' ? 'default' : 'outline'} className={`rounded-full px-6 ${normalizedMode === 'SURVIVAL' ? 'bg-green-600 hover:bg-green-700' : 'border-neutral-800'}`}>Survival</Button>
          </Link>
        </div>

        <Card className="bg-neutral-900/80 border-neutral-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-neutral-200">Top 50 - {normalizedMode}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard && leaderboard.map((session: any, index: number) => (
                <div 
                  key={session.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    index === 0 ? 'bg-yellow-500/10 border-yellow-500/50' : 
                    index === 1 ? 'bg-zinc-300/10 border-zinc-400/50' : 
                    index === 2 ? 'bg-amber-700/10 border-amber-700/50' : 
                    'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 font-bold text-neutral-500 flex justify-center">
                      {index === 0 ? <Crown className="w-6 h-6 text-yellow-500" /> : 
                       index === 1 ? <Medal className="w-6 h-6 text-zinc-400" /> : 
                       index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> : 
                       `#${index + 1}`}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-neutral-200">{session.user?.username || 'Unknown'}</p>
                      <p className="text-sm text-neutral-500">Highest Streak: {session.user?.highestStreak || 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-white">{session.score}</p>
                    <p className="text-xs text-neutral-500">XP</p>
                  </div>
                </div>
              ))}
              
              {leaderboard?.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  No scores yet. Be the first!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center pb-12">
          <Link href="/">
            <Button variant="outline" className="border-neutral-800 rounded-full px-8 hover:bg-neutral-800">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
