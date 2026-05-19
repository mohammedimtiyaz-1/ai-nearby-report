import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

const getPrismaClient = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const globalForPrisma = globalThis as unknown as { prisma: any }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// GET /api/v1/reports/[id] - Get a single report with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = await getPrismaClient()
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        scoreCard: true,
        aiSummary: true,
        pois: true,
        surveyChecklist: true,
      },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    if (report.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
