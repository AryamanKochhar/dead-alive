'use server'

import { generateQuestion } from '@/lib/game-engine';

export async function fetchNextQuestion() {
  try {
    const question = await generateQuestion();
    return { success: true, data: question };
  } catch (error: any) {
    console.error("Error generating question:", error);
    return { success: false, error: error.message };
  }
}
