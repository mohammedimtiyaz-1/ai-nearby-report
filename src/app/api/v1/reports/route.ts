import { NextRequest, NextResponse } from 'next/server'

// POST /api/v1/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { businessCategory, businessModel, location, latitude, longitude, radius } = body
    
    if (!businessCategory || !businessModel || !location || !latitude || !longitude || !radius) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Integrate with Prisma to create report in database
    // TODO: Call Google Places API to collect nearby POI data
    // TODO: Classify competitors, demand signals, accessibility indicators
    // TODO: Calculate feasibility scores
    // TODO: Generate AI summary using OpenAI

    // Mock response for now
    const report = {
      id: crypto.randomUUID(),
      userId: 'user-123', // TODO: Get from auth session
      businessCategory,
      businessModel,
      location,
      latitude,
      longitude,
      radius: parseInt(radius),
      rent: body.rent || null,
      shopSize: body.shopSize || null,
      setupBudget: body.setupBudget || null,
      staffCost: body.staffCost || null,
      inventoryCost: body.inventoryCost || null,
      status: 'COLLECTING_DATA',
      confidence: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(report, { status: 201 })
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
    // TODO: Get userId from auth session
    const userId = 'user-123'
    
    // TODO: Integrate with Prisma to fetch reports
    const reports: any[] = []

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
