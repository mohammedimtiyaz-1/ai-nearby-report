interface PlaceSearchResponse {
  places: {
    id: string
    name: string
    formattedAddress: string
    location: {
      lat: number
      lng: number
    }
    types: string[]
    rating?: number
    priceLevel?: number
    businessStatus?: string
  }[]
}

interface PlaceDetailsResponse {
  id: string
  name: string
  formattedAddress: string
  location: {
    lat: number
    lng: number
  }
  types: string[]
  rating?: number
  priceLevel?: number
  businessStatus?: string
}

export interface NearbyPOI {
  name: string
  type: 'competitor_direct' | 'competitor_indirect' | 'demand_signal' | 'accessibility_indicator'
  category?: string
  address?: string
  latitude: number
  longitude: number
  rating?: number
  priceLevel?: number
  isOpen?: boolean
}

export class GooglePlacesService {
  private apiKey: string
  private baseUrl = 'https://places.googleapis.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Autocomplete location search
   */
  async autocomplete(input: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/places:searchText`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
          },
          body: JSON.stringify({
            textQuery: input,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.places || []
    } catch (error) {
      console.error('Error in location autocomplete:', error)
      return []
    }
  }

  /**
   * Search for nearby places around a location
   */
  async searchNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number,
    businessCategory: string
  ): Promise<NearbyPOI[]> {
    const pois: NearbyPOI[] = []

    try {
      // Search for competitors
      const competitors = await this.searchCompetitors(latitude, longitude, radius, businessCategory)
      pois.push(...competitors)

      // Search for demand signals (schools, hospitals, malls, etc.)
      const demandSignals = await this.searchDemandSignals(latitude, longitude, radius)
      pois.push(...demandSignals)

      // Search for accessibility indicators (transit, parking, etc.)
      const accessibilityIndicators = await this.searchAccessibilityIndicators(latitude, longitude, radius)
      pois.push(...accessibilityIndicators)

      return pois
    } catch (error) {
      console.error('Error searching nearby places:', error)
      return []
    }
  }

  /**
   * Search for competitors based on business category
   */
  private async searchCompetitors(
    latitude: number,
    longitude: number,
    radius: number,
    businessCategory: string
  ): Promise<NearbyPOI[]> {
    const pois: NearbyPOI[] = []

    // Map business categories to Google Places types
    const categoryMap: Record<string, string[]> = {
      cafe: ['cafe', 'coffee_shop'],
      pharmacy: ['pharmacy', 'drugstore'],
      salon: ['hair_care', 'beauty_salon'],
      restaurant: ['restaurant', 'meal_delivery', 'meal_takeaway'],
      retail: ['store', 'shopping_mall'],
    }

    const types = categoryMap[businessCategory] || ['establishment']

    try {
      const response = await fetch(
        `${this.baseUrl}/places:searchNearby?location=${latitude},${longitude}&radius=${radius}&includedTypes=${types.join(',')}`,
        {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.name,places.formattedAddress,places.location,places.types,places.rating,places.priceLevel,places.businessStatus',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`)
      }

      const data: PlaceSearchResponse = await response.json()

      for (const place of data.places || []) {
        pois.push({
          name: place.name,
          type: this.classifyAsCompetitor(place.types, businessCategory),
          category: businessCategory,
          address: place.formattedAddress,
          latitude: place.location.lat,
          longitude: place.location.lng,
          rating: place.rating,
          priceLevel: place.priceLevel,
          isOpen: place.businessStatus === 'OPERATIONAL',
        })
      }
    } catch (error) {
      console.error('Error searching competitors:', error)
    }

    return pois
  }

  /**
   * Search for demand signals (schools, hospitals, offices, etc.)
   */
  private async searchDemandSignals(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<NearbyPOI[]> {
    const pois: NearbyPOI[] = []
    const demandTypes = ['school', 'university', 'hospital', 'transit_station', 'office', 'company']

    try {
      const response = await fetch(
        `${this.baseUrl}/places:searchNearby?location=${latitude},${longitude}&radius=${radius}&includedTypes=${demandTypes.join(',')}`,
        {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.name,places.formattedAddress,places.location,places.types',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`)
      }

      const data: PlaceSearchResponse = await response.json()

      for (const place of data.places || []) {
        pois.push({
          name: place.name,
          type: 'demand_signal',
          category: this.categorizeDemandSignal(place.types),
          address: place.formattedAddress,
          latitude: place.location.lat,
          longitude: place.location.lng,
        })
      }
    } catch (error) {
      console.error('Error searching demand signals:', error)
    }

    return pois
  }

  /**
   * Search for accessibility indicators (transit, parking, etc.)
   */
  private async searchAccessibilityIndicators(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<NearbyPOI[]> {
    const pois: NearbyPOI[] = []
    const accessibilityTypes = ['transit_station', 'subway_station', 'bus_station', 'parking', 'train_station']

    try {
      const response = await fetch(
        `${this.baseUrl}/places:searchNearby?location=${latitude},${longitude}&radius=${radius}&includedTypes=${accessibilityTypes.join(',')}`,
        {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'places.id,places.name,places.formattedAddress,places.location,places.types',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`)
      }

      const data: PlaceSearchResponse = await response.json()

      for (const place of data.places || []) {
        pois.push({
          name: place.name,
          type: 'accessibility_indicator',
          category: 'transportation',
          address: place.formattedAddress,
          latitude: place.location.lat,
          longitude: place.location.lng,
        })
      }
    } catch (error) {
      console.error('Error searching accessibility indicators:', error)
    }

    return pois
  }

  /**
   * Classify a place as direct or indirect competitor
   */
  private classifyAsCompetitor(types: string[], businessCategory: string): 'competitor_direct' | 'competitor_indirect' {
    const categoryMap: Record<string, string[]> = {
      cafe: ['cafe', 'coffee_shop'],
      pharmacy: ['pharmacy', 'drugstore'],
      salon: ['hair_care', 'beauty_salon'],
      restaurant: ['restaurant'],
      retail: ['store'],
    }

    const relevantTypes = categoryMap[businessCategory] || []
    const hasRelevantType = types.some(type => relevantTypes.includes(type))

    return hasRelevantType ? 'competitor_direct' : 'competitor_indirect'
  }

  /**
   * Categorize demand signal based on place types
   */
  private categorizeDemandSignal(types: string[]): string {
    if (types.includes('school') || types.includes('university')) return 'education'
    if (types.includes('hospital')) return 'healthcare'
    if (types.includes('transit_station') || types.includes('subway_station')) return 'transportation'
    if (types.includes('office') || types.includes('company')) return 'commercial'
    return 'other'
  }

  /**
   * Get place details by ID
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResponse | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/places/${placeId}`,
        {
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'id,name,formattedAddress,location,types,rating,priceLevel,businessStatus',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting place details:', error)
      return null
    }
  }
}

export const googlePlacesService = new GooglePlacesService(process.env.GOOGLE_PLACES_API_KEY || '')
