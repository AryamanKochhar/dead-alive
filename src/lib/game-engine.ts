import { prisma } from './prisma'

export async function generateQuestion() {
  const figureCount = await prisma.historicalFigure.count()
  const eventCount = await prisma.historicalEvent.count()
  
  if (figureCount === 0 || eventCount === 0) {
    throw new Error("Database not seeded")
  }

  // 50% chance we try to force a YES, 50% NO
  const isTargetYes = Math.random() > 0.5;

  let figure;
  let event;

  if (isTargetYes) {
    event = await getRandomEvent();
    
    // Find a figure alive during this event
    const figures = await prisma.historicalFigure.findMany({
      where: {
        birthYear: { lte: event.eventYear },
        OR: [
          { deathYear: null },
          { deathYear: { gte: event.eventYear } }
        ]
      },
      take: 50
    });
    
    if (figures.length > 0) {
      figure = figures[Math.floor(Math.random() * figures.length)];
    } else {
      figure = await getRandomFigure();
    }
  } else {
    event = await getRandomEvent();
    // Find a figure NOT alive during this event
    const figures = await prisma.historicalFigure.findMany({
      where: {
        OR: [
          { birthYear: { gt: event.eventYear } },
          { deathYear: { lt: event.eventYear, not: null } }
        ]
      },
      take: 50
    });
    if (figures.length > 0) {
      figure = figures[Math.floor(Math.random() * figures.length)];
    } else {
      figure = await getRandomFigure();
    }
  }

  // Calculate actual truth because fallback might change the target
  const isAlive = event.eventYear >= figure.birthYear && (figure.deathYear === null || event.eventYear <= figure.deathYear);

  return {
    figure,
    event,
    correctAnswer: isAlive
  }
}

async function getRandomEvent() {
  const count = await prisma.historicalEvent.count();
  const skip = Math.floor(Math.random() * count);
  const result = await prisma.historicalEvent.findFirst({ skip });
  if (!result) throw new Error("No events found");
  return result;
}

async function getRandomFigure() {
  const count = await prisma.historicalFigure.count();
  const skip = Math.floor(Math.random() * count);
  const result = await prisma.historicalFigure.findFirst({ skip });
  if (!result) throw new Error("No figures found");
  return result;
}
