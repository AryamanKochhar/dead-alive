'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fetchNextQuestion } from '@/app/actions'
import { useGameStore } from '@/lib/store'
import { Loader2, Heart, Flame, Trophy, Clock } from 'lucide-react'
import { toast } from 'sonner'
import Timeline from './Timeline'

type GameMode = 'CLASSIC' | 'SURVIVAL' | 'TIMED'

export default function GameBoard({ mode }: { mode: GameMode }) {
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answering, setAnswering] = useState(false)
  const [result, setResult] = useState<'CORRECT' | 'WRONG' | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)

  const { score, streak, lives, incrementScore, incrementStreak, resetStreak, loseLife, resetGame } = useGameStore()

  const loadQuestion = async () => {
    setLoading(true)
    setResult(null)
    setAnswering(false)
    const res = await fetchNextQuestion()
    if (res.success && res.data) {
      setQuestion(res.data)
    } else {
      toast.error("Failed to load question")
    }
    setLoading(false)
  }

  useEffect(() => {
    resetGame(mode)
    loadQuestion()
  }, [mode, resetGame])

  useEffect(() => {
    if (mode === 'TIMED' && timeLeft > 0 && !loading && !answering) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [mode, timeLeft, loading, answering])

  const handleAnswer = async (guess: boolean) => {
    if (answering || !question) return
    setAnswering(true)
    
    const isCorrect = guess === question.correctAnswer
    
    if (isCorrect) {
      setResult('CORRECT')
      incrementScore(100 + streak * 10)
      incrementStreak()
    } else {
      setResult('WRONG')
      resetStreak()
      if (mode === 'SURVIVAL') loseLife()
    }

    // Wait to show the result and timeline
    setTimeout(() => {
      if (mode === 'SURVIVAL' && lives <= 1 && !isCorrect) {
        // Game Over handled by UI
      } else if (mode === 'CLASSIC' && !isCorrect) {
        // Game Over handled by UI
      } else if (mode === 'TIMED' && timeLeft <= 0) {
        // Game Over handled by UI
      } else {
        loadQuestion()
      }
    }, 3000)
  }

  if (loading && !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-red-500" />
      </div>
    )
  }

  const isGameOver = 
    (mode === 'SURVIVAL' && lives === 0) || 
    (mode === 'CLASSIC' && result === 'WRONG') ||
    (mode === 'TIMED' && timeLeft === 0)

  if (isGameOver && !answering) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-5xl font-black text-red-500">GAME OVER</h2>
        <div className="space-y-2">
          <p className="text-2xl text-neutral-300">Final Score: <span className="font-bold text-white">{score}</span></p>
          <p className="text-xl text-neutral-400">Highest Streak: <span className="font-bold text-orange-400">{streak}</span></p>
        </div>
        <Button onClick={() => { resetGame(mode); loadQuestion(); }} className="bg-red-600 hover:bg-red-700 h-12 px-8 rounded-full text-lg font-bold">
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
      {/* Header Stats */}
      <div className="w-full flex justify-between items-center px-4 py-3 bg-neutral-900/50 rounded-2xl border border-neutral-800 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-neutral-300 font-medium">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>{score}</span>
        </div>
        
        {mode === 'TIMED' && (
          <div className="flex items-center space-x-2 text-xl font-bold text-blue-400">
            <Clock className="w-6 h-6" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        )}

        {mode === 'SURVIVAL' && (
          <div className="flex items-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-neutral-700'}`} />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 font-bold">
          <Flame className={`w-6 h-6 ${streak > 2 ? 'text-orange-500' : 'text-neutral-600'}`} />
          <span className={streak > 2 ? 'text-orange-500' : 'text-neutral-400'}>x{streak}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.figure?.id + question?.event?.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className={`relative overflow-hidden bg-neutral-900 border-2 transition-colors duration-500 ${
            result === 'CORRECT' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 
            result === 'WRONG' ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 
            'border-neutral-800'
          }`}>
            <div className="p-8 md:p-12 text-center space-y-8">
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-neutral-400 font-medium uppercase tracking-widest">Was</p>
                <h2 className="text-4xl md:text-6xl font-black text-white">{question?.figure?.name}</h2>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-neutral-400 font-medium uppercase tracking-widest">Alive during</p>
                <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  {question?.event?.title}?
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-8">
                <Button 
                  onClick={() => handleAnswer(true)}
                  disabled={answering}
                  className={`h-20 text-2xl font-black rounded-2xl transition-all ${
                    answering && question?.correctAnswer === true ? 'bg-green-600 hover:bg-green-600' : 
                    answering ? 'bg-neutral-800 opacity-50' : 'bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border border-green-600/50'
                  }`}
                >
                  YES
                </Button>
                <Button 
                  onClick={() => handleAnswer(false)}
                  disabled={answering}
                  className={`h-20 text-2xl font-black rounded-2xl transition-all ${
                    answering && question?.correctAnswer === false ? 'bg-red-600 hover:bg-red-600' : 
                    answering ? 'bg-neutral-800 opacity-50' : 'bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/50'
                  }`}
                >
                  NO
                </Button>
              </div>

              {/* Result & Timeline Reveal */}
              <AnimatePresence>
                {answering && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-8 border-t border-neutral-800 text-left space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-3xl font-black ${result === 'CORRECT' ? 'text-green-500' : 'text-red-500'}`}>
                          {result === 'CORRECT' ? 'CORRECT!' : 'WRONG!'}
                        </h4>
                        <p className="text-neutral-300 mt-2 text-lg">
                          {question?.figure?.name} lived from {question?.figure?.birthYear} to {question?.figure?.deathYear || 'Present'}
                        </p>
                        <p className="text-neutral-400">
                          {question?.event?.title} happened in {question?.event?.eventYear}
                        </p>
                      </div>
                    </div>
                    
                    <Timeline figure={question?.figure} event={question?.event} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
