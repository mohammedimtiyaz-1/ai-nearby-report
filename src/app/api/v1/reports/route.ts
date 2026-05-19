import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { getPrisma } from '@/lib/prisma'
import { googlePlacesService, type NearbyPOI } from '@/lib/services/google-places'
import { scoringEngine, type ScoringInput } from '@/lib/services/scoring-engine'
import { aiReportService } from '@/lib/services/ai-report'

const createReportSchema = z.object({
  businessCategory: z.string().min(1),
  businessModel: z.string().min(1),
  location: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().int().positive(),
  rent: z.number().optional(),
  shopSize: z.number().optional(),
  setupBudget: z.number().optional(),
  staffCost: z.number().optional(),
  inventoryCost: z.number().optional(),
})

// POST /api/v1/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    const body = await request.json()
    
    // Validate required fields
    const validation = createReportSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.format() },
        { status: 400 }
      )
    }

    const data = validation.data

    // Get user from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create report in database with initial status
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        businessCategoryId: data.businessCategory,
        businessModel: data.businessModel,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
        rent: data.rent || null,
        shopSize: data.shopSize || null,
        setupBudget: data.setupBudget || null,
        staffCost: data.staffCost || null,
        inventoryCost: data.inventoryCost || null,
        status: 'COLLECTING_DATA',
        confidence: 0,
      },
    })

    // 1. Collect nearby POI data from Google Places
    const pois: NearbyPOI[] = await googlePlacesService.searchNearbyPlaces(
      data.latitude,
      data.longitude,
      data.radius,
      data.businessCategory
    )

    // Store POIs in database
    const reportPOIs = await Promise.all(
      pois.map(poi =>
        prisma.reportPOI.create({
          data: {
            reportId: report.id,
            name: poi.name,
            type: poi.type,
            category: poi.category,
            address: poi.address,
            latitude: poi.latitude,
            longitude: poi.longitude,
            rating: poi.rating,
            priceLevel: poi.priceLevel,
            isOpen: poi.isOpen,
          },
        })
      )
    )

    // 2. Calculate feasibility scores
    const scoringInput: ScoringInput = {
      pois: reportPOIs,
      financialData: {
        rent: data.rent,
        shopSize: data.shopSize,
        setupBudget: data.setupBudget,
        staffCost: data.staffCost,
        inventoryCost: data.inventoryCost,
      },
    }

    const scores = scoringEngine.calculateScores(scoringInput)

    // Create score card
    await prisma.scoreCard.create({
      data: {
        reportId: report.id,
        competitionScore: scores.competitionScore,
        demandScore: scores.demandScore,
        accessibilityScore: scores.accessibilityScore,
        areaFitScore: scores.areaFitScore,
        financialPressureScore: scores.financialPressureScore,
        competitionReason: scores.reasons.competition,
        demandReason: scores.reasons.demand,
        accessibilityReason: scores.reasons.accessibility,
        areaFitReason: scores.reasons.areaFit,
        financialPressureReason: scores.reasons.financialPressure,
      },
    })

    // 3. Generate AI report
    const aiReport = await aiReportService.generateReport({
      businessCategory: data.businessCategory,
      businessModel: data.businessModel,
      location: data.location,
      radius: data.radius,
      competitionScore: scores.competitionScore,
      demandScore: scores.demandScore,
      accessibilityScore: scores.accessibilityScore,
      areaFitScore: scores.areaFitScore,
      financialPressureScore: scores.financialPressureScore,
      confidence: scores.confidence,
      competitorCount: reportPOIs.filter((p: any) => p.type === 'competitor_direct' || p.type === 'competitor_indirect').length,
      demandSignalCount: reportPOIs.filter((p: any) => p.type === 'demand_signal').length,
      financialData: scoringInput.financialData,
    })

    // Store AI summary in database
    await prisma.aISummary.create({
      data: {
        reportId: report.id,
        executiveSummary: aiReport.executiveSummary,
        opportunities: aiReport.opportunities,
        risks: aiReport.risks,
        recommendation: aiReport.recommendation,
        disclaimer: aiReport.disclaimer,
        modelName: 'gpt-4o-mini',
      },
    })

    // 4. Create default survey checklist tasks
    const defaultTasks = [
      'Visit at different times of day',
      'Count pedestrian movement manually',
      'Observe competitor crowd',
      'Check parking availability',
      'Check visibility from street',
    ]

    await Promise.all(
      defaultTasks.map(task =>
        prisma.surveyChecklist.create({
          data: {
            reportId: report.id,
            task,
            completed: false,
          },
        })
      )
    )

    // 5. Update report with final status
    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        status: scores.confidence > 50 ? 'COMPLETED' : 'COMPLETED_WITH_WARNINGS',
        confidence: scores.confidence,
      },
      include: {
        scoreCard: true,
        aiSummary: true,
        pois: true,
        surveyChecklist: true,
      },
    })

    return NextResponse.json(updatedReport, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

// GET /api/v1/reports - List all reports for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    // Get user from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const reports = await prisma.report.findMany({
      where: { userId: user.id },
      include: {
        scoreCard: true,
        pois: true,
        surveyChecklist: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
