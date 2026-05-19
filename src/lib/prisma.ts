import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const getPrisma = (): ReturnType<typeof prismaClientSingleton> => {
  if (typeof window !== 'undefined') {
    throw new Error('getPrisma should only be called on the server')
  }
  
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prismaClientSingleton()
  }
  
  return globalForPrisma.prisma
}



