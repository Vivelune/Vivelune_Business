import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

// Move adapter creation INSIDE the singleton check to prevent connection leaks
const prisma = globalForPrisma.prisma || (() => {
    const connectionString = process.env.NODE_ENV === "development" 
        ? process.env.DATABASE_URL_DEVELOPMENT 
        : process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error(
            `Database connection string is not defined. ` +
            `NODE_ENV=${process.env.NODE_ENV}. ` +
            `Please set ${process.env.NODE_ENV === 'development' ? 'DATABASE_URL_DEVELOPMENT' : 'DATABASE_URL'}`
        )
    }

    const adapter = new PrismaPg({ connectionString })
    
    return new PrismaClient({ adapter })
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma