import { OpenAI } from 'openai'
import { googlePlacesService } from './google-places'

export interface RecommendationInput {
  latitude: number
  longitude: number
  radius: number
  locationName: string
}

export interface RecommendationResult {
  suggestedCategory: string
  confidence: number
  analysis: string
  competitorCounts: Record<string, number>
}

export class RecommendationEngine {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  /**
   * Suggest the best business to open at a location based on gaps in the market
   */
  async getRecommendation(input: RecommendationInput): Promise<RecommendationResult> {
    try {
      const categories = ['cafe', 'pharmacy', 'salon', 'restaurant', 'retail']
      const competitorCounts: Record<string, number> = {}
      
      // 1. Gather POI data for all categories
      await Promise.all(
        categories.map(async (cat) => {
          const pois = await googlePlacesService.searchNearbyPlaces(
            input.latitude,
            input.longitude,
            input.radius,
            cat
          )
          competitorCounts[cat] = pois.filter(p => p.type === 'competitor_direct').length
        })
      )

      // 2. Fetch demand signals and accessibility
      const demandSignals = await googlePlacesService.searchNearbyPlaces(
        input.latitude,
        input.longitude,
        input.radius,
        'establishment' // General search for demand signals
      )
      const demandCount = demandSignals.filter(p => p.type === 'demand_signal').length
      const transportCount = demandSignals.filter(p => p.type === 'accessibility_indicator').length

      // 3. Use AI to analyze the data and provide a recommendation
      const prompt = `
Location: ${input.locationName} (Radius: ${input.radius}m)
Competitor Density (Direct):
${Object.entries(competitorCounts).map(([cat, count]) => `- ${cat}: ${count} competitors`).join('\n')}

Market Context:
- Demand Signals (Offices/Schools/etc): ${demandCount}
- Accessibility (Transit/Parking): ${transportCount}

Based on this data, which business among (Cafe, Pharmacy, Salon, Restaurant, Retail) has the highest feasibility?
Consider where the competition is low relative to the general demand signals.

Provide:
1. Suggested Category: [Category Name]
2. Confidence Score: [0-100]
3. Analysis: [Detailed reasoning in 2-3 sentences]
`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a retail strategy consultant specializing in market gap analysis.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content || ''
      
      // Simple parsing of AI response
      const suggestedCategoryMatch = content.match(/Suggested Category:\s*(.*)/i)
      const confidenceMatch = content.match(/Confidence Score:\s*(\d+)/i)
      const analysisParts = content.split(/Analysis:\s*/i)

      return {
        suggestedCategory: suggestedCategoryMatch ? suggestedCategoryMatch[1].trim() : 'Uncertain',
        confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
        analysis: analysisParts.length > 1 ? analysisParts[1].trim() : 'Manual analysis required.',
        competitorCounts,
      }
    } catch (error) {
      console.error('Recommendation engine error:', error)
      return {
        suggestedCategory: 'Error',
        confidence: 0,
        analysis: 'Failed to generate recommendation due to service error.',
        competitorCounts: {},
      }
    }
  }
}

export const recommendationEngine = new RecommendationEngine()
