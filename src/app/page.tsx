import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Clock, Skull, PlayCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
      </div>

      <div className="z-10 w-full max-w-3xl space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-orange-500">
            DEAD OR ALIVE
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-medium">
            Were they alive when history happened?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm hover:border-red-500/50 transition-colors">
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-2xl text-neutral-100">Classic</CardTitle>
              <CardDescription className="text-neutral-400">Infinite rounds until your first mistake</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/play?mode=CLASSIC">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-lg rounded-full">
                  Play Classic <PlayCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <CardTitle className="text-2xl text-neutral-100">Timed</CardTitle>
              <CardDescription className="text-neutral-400">60 seconds to get as many right as you can</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/play?mode=TIMED">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg rounded-full">
                  Play Timed <PlayCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm hover:border-green-500/50 transition-colors">
            <CardHeader className="text-center">
              <Skull className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <CardTitle className="text-2xl text-neutral-100">Survival</CardTitle>
              <CardDescription className="text-neutral-400">3 lives. How long can you survive?</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/play?mode=SURVIVAL">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg rounded-full">
                  Play Survival <PlayCircle className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8">
          <Link href="/leaderboard">
            <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-full px-8">
              View Leaderboards
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
