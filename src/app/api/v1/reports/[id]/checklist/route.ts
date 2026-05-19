import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getPrisma } from '@/lib/prisma'

// PATCH /api/v1/reports/[id]/checklist - Update survey checklist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    const { id: reportId } = await params
    const body = await request.json()
    const { taskId, completed, notes } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Missing taskId' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify report exists and belongs to user
    const report = await prisma.report.findUnique({
      where: { id: reportId },
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
