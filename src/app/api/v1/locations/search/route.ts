import { NextRequest, NextResponse } from 'next/server'
import { googlePlacesService } from '@/lib/services/google-places'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 3) {
    return NextResponse.json({ places: [] })
  }

  try {
    const places = await googlePlacesService.autocomplete(query)
    
    const formattedPlaces = places.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
    }))

    return NextResponse.json({ places: formattedPlaces })
  } catch (error) {
    console.error('Location search error:', error)
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    )
  }
}
