import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const connectionString = process.env.NODE_ENV === "development" 
    ? process.env.DATABASE_URL_DEVELOPMENT 
    : process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('Database connection string is not defined')
}

// Add SSL configuration for production
const sslConfig = process.env.NODE_ENV === 'production' 
    ? { 
        ssl: { 
            rejectUnauthorized: true,
            // For Vercel Postgres, you might need:
            // sslmode: 'require' 
        } 
      }
    : {};

const adapter = new PrismaPg({
    connectionString,
    ...sslConfig,
})

const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma