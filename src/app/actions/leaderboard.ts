'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitScore(username: string, score: number, mode: string, highestStreak: number) {
  try {
    // Upsert user based on username
    const user = await prisma.user.upsert({
      where: { username },
      update: {
        xp: { increment: score },
        highestStreak: { set: Math.max(highestStreak) }
      },
      create: {
        username,
        xp: score,
        highestStreak
      }
    })

    // Create game session
    await prisma.gameSession.create({
      data: {
        userId: user.id,
        score,
        mode
      }
    })

    // If their new highest streak is greater than previous, we need to handle that via upsert logic correctly
    // The upsert above currently just sets highestStreak to the new highestStreak, which might overwrite a globally higher one if we aren't careful.
    // Let's do a safe update:
    if (user.highestStreak < highestStreak) {
      await prisma.user.update({
        where: { id: user.id },
        data: { highestStreak }
      })
    }

    revalidatePath('/leaderboard')
    return { success: true }
  } catch (error: any) {
    console.error("Error submitting score:", error)
    return { success: false, error: error.message }
  }
}

export async function getLeaderboard(mode: string = 'CLASSIC') {
  try {
    const sessions = await prisma.gameSession.findMany({
      where: { mode },
      orderBy: { score: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            username: true,
            highestStreak: true
          }
        }
      }
    })
    
    // We only want the top score per user per mode.
    // Let's do a simple group by or filter locally since take: 50 isn't huge.
    const uniqueUsers = new Map()
    for (const session of sessions) {
      if (!uniqueUsers.has(session.userId) || uniqueUsers.get(session.userId).score < session.score) {
        uniqueUsers.set(session.userId, session)
      }
    }

    const leaderboard = Array.from(uniqueUsers.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)

    return { success: true, data: leaderboard }
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error)
    return { success: false, error: error.message }
  }
}
