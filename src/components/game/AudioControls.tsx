'use client'

import { useGameStore } from '@/lib/store'
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AudioControls() {
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useGameStore()

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
      <audio id="bgm-audio" src="/sounds/bgm.mp3" loop preload="auto" />
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleMusic}
        className="rounded-full bg-neutral-900/80 border-neutral-800 hover:bg-neutral-800 backdrop-blur-md"
      >
        {musicEnabled ? <Music className="w-4 h-4 text-neutral-300" /> : <Music2 className="w-4 h-4 text-neutral-600 opacity-50" />}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleSound}
        className="rounded-full bg-neutral-900/80 border-neutral-800 hover:bg-neutral-800 backdrop-blur-md"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4 text-neutral-300" /> : <VolumeX className="w-4 h-4 text-neutral-600 opacity-50" />}
      </Button>
    </div>
  )
}
