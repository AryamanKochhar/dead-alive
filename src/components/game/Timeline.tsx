'use client'

import { motion } from 'framer-motion'

export default function Timeline({ figure, event }: { figure: any, event: any }) {
  // Timeline bounds
  const minYear = Math.min(figure.birthYear, event.eventYear) - 50;
  const maxYear = Math.max(figure.deathYear || new Date().getFullYear(), event.eventYear) + 50;
  const totalYears = maxYear - minYear;

  // Calculate percentages
  const birthPos = ((figure.birthYear - minYear) / totalYears) * 100;
  const deathPos = figure.deathYear ? ((figure.deathYear - minYear) / totalYears) * 100 : 100;
  const eventPos = ((event.eventYear - minYear) / totalYears) * 100;

  return (
    <div className="w-full relative py-8 select-none">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-2 bg-neutral-800 rounded-full -translate-y-1/2" />
      
      {/* Figure Lifespan */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: `${deathPos - birthPos}%`, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/2 h-2 bg-neutral-600 rounded-full -translate-y-1/2"
        style={{ left: `${birthPos}%` }}
      />
      
      {/* Figure Labels */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-0 -translate-x-1/2 -translate-y-full pb-4 flex flex-col items-center"
        style={{ left: `${birthPos}%` }}
      >
        <span className="text-xs text-neutral-500 font-bold">{figure.birthYear}</span>
        <div className="w-px h-4 bg-neutral-600 mt-1" />
      </motion.div>
      
      {figure.deathYear && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-0 -translate-x-1/2 -translate-y-full pb-4 flex flex-col items-center"
          style={{ left: `${deathPos}%` }}
        >
          <span className="text-xs text-neutral-500 font-bold">{figure.deathYear}</span>
          <div className="w-px h-4 bg-neutral-600 mt-1" />
        </motion.div>
      )}

      {/* Event Marker */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute top-1/2 w-4 h-4 rounded-full bg-red-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(239,68,68,1)] z-10"
        style={{ left: `${eventPos}%` }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute top-1/2 pt-4 -translate-x-1/2 flex flex-col items-center"
        style={{ left: `${eventPos}%` }}
      >
        <div className="w-px h-4 bg-red-500/50 mb-1" />
        <span className="text-xs text-red-400 font-bold whitespace-nowrap">{event.eventYear}</span>
      </motion.div>
    </div>
  )
}
