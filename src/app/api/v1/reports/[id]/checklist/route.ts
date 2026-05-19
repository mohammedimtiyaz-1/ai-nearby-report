import { NextRequest, NextResponse } from 'next/server'

const getPrismaClient = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const globalForPrisma = globalThis as unknown as { prisma: any }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// PATCH /api/v1/reports/[id]/checklist - Update survey checklist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = await getPrismaClient()
    const { id: reportId } = await params
    const body = await request.json()
    const { taskId, completed, notes } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      )
    }

    // Verify report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Upsert checklist item
    const checklistItem = await prisma.surveyChecklist.upsert({
      where: {
        id: taskId,
      },
      update: {
        completed: completed ?? undefined,
        notes: notes ?? undefined,
      },
      create: {
        id: taskId,
        reportId,
        task: body.task || 'Untitled task',
        completed: completed ?? false,
        notes: notes ?? '',
      },
    })

    return NextResponse.json({ checklistItem })
  } catch (error) {
    console.error('Error updating checklist:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist' },
      { status: 500 }
    )
  }
}
