import { NextRequest, NextResponse } from 'next/server'
import { googlePlacesService, type NearbyPOI } from '@/lib/services/google-places'
import { scoringEngine, type ScoringInput } from '@/lib/services/scoring-engine'
import { aiReportService } from '@/lib/services/ai-report'

// Lazy initialize Prisma to avoid build-time instantiation
const getPrismaClient = async () => {
  const { PrismaClient } = await import('@prisma/client')
  const globalForPrisma = globalThis as unknown as { prisma: any }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  
  return globalForPrisma.prisma
}

// POST /api/v1/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const prisma = await getPrismaClient()
    const body = await request.json()
    
    // Validate required fields
    const { businessCategory, businessModel, location, latitude, longitude, radius } = body
    
    if (!businessCategory || !businessModel || !location || !latitude || !longitude || !radius) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create report in database with initial status
    const report = await prisma.report.create({
      data: {
        userId: 'user-123', // TODO: Get from auth session
        businessCategoryId: businessCategory,
        businessModel,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius),
        rent: body.rent ? parseFloat(body.rent) : null,
        shopSize: body.shopSize ? parseFloat(body.shopSize) : null,
        setupBudget: body.setupBudget ? parseFloat(body.setupBudget) : null,
        staffCost: body.staffCost ? parseFloat(body.staffCost) : null,
        inventoryCost: body.inventoryCost ? parseFloat(body.inventoryCost) : null,
        status: 'COLLECTING_DATA',
        confidence: 0,
      },
    })

    // Collect nearby POI data from Google Places
    const pois: NearbyPOI[] = await googlePlacesService.searchNearbyPlaces(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius),
      businessCategory
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

    // Calculate feasibility scores
    const scoringInput: ScoringInput = {
      pois: reportPOIs,
      financialData: {
        rent: body.rent ? parseFloat(body.rent) : undefined,
        shopSize: body.shopSize ? parseFloat(body.shopSize) : undefined,
        setupBudget: body.setupBudget ? parseFloat(body.setupBudget) : undefined,
        staffCost: body.staffCost ? parseFloat(body.staffCost) : undefined,
        inventoryCost: body.inventoryCost ? parseFloat(body.inventoryCost) : undefined,
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

    // Generate AI report
    const aiReport = await aiReportService.generateReport({
      businessCategory,
      businessModel,
      location,
      radius: parseInt(radius),
      competitionScore: scores.competitionScore,
      demandScore: scores.demandScore,
      accessibilityScore: scores.accessibilityScore,
      areaFitScore: scores.areaFitScore,
      financialPressureScore: scores.financialPressureScore,
      confidence: scores.confidence,
      competitorCount: reportPOIs.filter(p => p.type === 'competitor_direct' || p.type === 'competitor_indirect').length,
      demandSignalCount: reportPOIs.filter(p => p.type === 'demand_signal').length,
      financialData: scoringInput.financialData,
    })

    // Update report with final status
    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        status: scores.confidence > 50 ? 'COMPLETED' : 'COMPLETED_WITH_WARNINGS',
        confidence: scores.confidence,
      },
    })

    return NextResponse.json({
      ...updatedReport,
      scores,
      aiReport,
    }, { status: 201 })
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
    const prisma = await getPrismaClient()
    // TODO: Get userId from auth session
    const userId = 'user-123'
    
    const reports = await prisma.report.findMany({
      where: { userId },
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
