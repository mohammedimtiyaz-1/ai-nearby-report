import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getPrisma } from '@/lib/prisma'
import { recommendationEngine } from '@/lib/services/recommendation-engine'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    const body = await request.json()
    const { location, latitude, longitude, radius } = body

    if (!location || !latitude || !longitude || !radius) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get recommendation from engine
    const recommendationResult = await recommendationEngine.getRecommendation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseInt(radius),
      locationName: location,
    })

    // Store in database
    const recommendation = await prisma.recommendation.create({
      data: {
        userId: user.id,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius),
        suggestedCategory: recommendationResult.suggestedCategory,
        confidence: recommendationResult.confidence,
        analysis: recommendationResult.analysis,
        competitorData: recommendationResult.competitorCounts,
      },
    })

    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    console.error('Recommendation API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Fetch recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
