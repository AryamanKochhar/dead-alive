import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const figures = [
  { name: "Nikola Tesla", birthYear: 1856, deathYear: 1943, shortDescription: "Inventor of alternating current.", difficulty: "EASY" },
  { name: "Albert Einstein", birthYear: 1879, deathYear: 1955, shortDescription: "Developed the theory of relativity.", difficulty: "EASY" },
  { name: "Cleopatra", birthYear: -69, deathYear: -30, shortDescription: "Last active ruler of the Ptolemaic Kingdom of Egypt.", difficulty: "MEDIUM" },
  { name: "Julius Caesar", birthYear: -100, deathYear: -44, shortDescription: "Roman general and statesman.", difficulty: "EASY" },
  { name: "Leonardo da Vinci", birthYear: 1452, deathYear: 1519, shortDescription: "Italian polymath of the High Renaissance.", difficulty: "EASY" },
  { name: "Isaac Newton", birthYear: 1643, deathYear: 1727, shortDescription: "English mathematician and physicist.", difficulty: "EASY" },
  { name: "Marie Curie", birthYear: 1867, deathYear: 1934, shortDescription: "Physicist and chemist who conducted pioneering research on radioactivity.", difficulty: "EASY" },
  { name: "Galileo Galilei", birthYear: 1564, deathYear: 1642, shortDescription: "Italian astronomer, physicist and engineer.", difficulty: "MEDIUM" },
  { name: "Alexander the Great", birthYear: -356, deathYear: -323, shortDescription: "King of the ancient Greek kingdom of Macedon.", difficulty: "MEDIUM" },
  { name: "Genghis Khan", birthYear: 1162, deathYear: 1227, shortDescription: "Founder and first Great Khan of the Mongol Empire.", difficulty: "MEDIUM" },
  { name: "William Shakespeare", birthYear: 1564, deathYear: 1616, shortDescription: "English playwright, poet and actor.", difficulty: "EASY" },
  { name: "George Washington", birthYear: 1732, deathYear: 1799, shortDescription: "First President of the United States.", difficulty: "EASY" },
  { name: "Abraham Lincoln", birthYear: 1809, deathYear: 1865, shortDescription: "16th President of the United States.", difficulty: "EASY" },
  { name: "Charles Darwin", birthYear: 1809, deathYear: 1882, shortDescription: "English naturalist, geologist and biologist.", difficulty: "EASY" },
  { name: "Wolfgang Amadeus Mozart", birthYear: 1756, deathYear: 1791, shortDescription: "Prolific and influential composer of the Classical period.", difficulty: "EASY" },
]

const events = [
  { title: "Sinking of the Titanic", eventYear: 1912, category: "Disaster", shortDescription: "The RMS Titanic sank in the North Atlantic Ocean." },
  { title: "Apollo 11 Moon Landing", eventYear: 1969, category: "Space", shortDescription: "Humans walk on the Moon for the first time." },
  { title: "Fall of the Western Roman Empire", eventYear: 476, category: "War", shortDescription: "Romulus Augustulus is deposed." },
  { title: "French Revolution begins", eventYear: 1789, category: "Politics", shortDescription: "Storming of the Bastille." },
  { title: "Discovery of America by Columbus", eventYear: 1492, category: "Exploration", shortDescription: "Christopher Columbus lands in the Americas." },
  { title: "Assassination of Archduke Franz Ferdinand", eventYear: 1914, category: "Politics", shortDescription: "Sparked the beginning of World War I." },
  { title: "End of World War II", eventYear: 1945, category: "War", shortDescription: "Japan surrenders to the Allies." },
  { title: "Wright Brothers First Flight", eventYear: 1903, category: "Aviation", shortDescription: "First successful flight of a powered airplane." },
  { title: "Construction of the Great Pyramid of Giza", eventYear: -2560, category: "Architecture", shortDescription: "Completion of the largest pyramid in Egypt." },
  { title: "Signing of the Magna Carta", eventYear: 1215, category: "Politics", shortDescription: "King John of England is forced to sign the charter." },
]

async function main() {
  console.log('Seeding data...')
  
  for (const f of figures) {
    await prisma.historicalFigure.create({
      data: {
        name: f.name,
        birthYear: f.birthYear,
        deathYear: f.deathYear,
        shortDescription: f.shortDescription,
        difficulty: f.difficulty
      }
    })
  }

  for (const e of events) {
    await prisma.historicalEvent.create({
      data: {
        title: e.title,
        eventYear: e.eventYear,
        category: e.category,
        shortDescription: e.shortDescription
      }
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
