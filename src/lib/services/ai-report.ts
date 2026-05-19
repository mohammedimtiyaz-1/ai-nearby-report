import { OpenAI } from 'openai'

export interface AIReportInput {
  businessCategory: string
  businessModel: string
  location: string
  radius: number
  competitionScore: number
  demandScore: number
  accessibilityScore: number
  areaFitScore: number
  financialPressureScore: number
  confidence: number
  competitorCount: number
  demandSignalCount: number
  financialData?: {
    rent?: number
    shopSize?: number
    setupBudget?: number
    staffCost?: number
    inventoryCost?: number
  }
}

export interface AIReportOutput {
  executiveSummary: string
  opportunities: string[]
  risks: string[]
  recommendation: string
  disclaimer: string
}

export class AIReportService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  /**
   * Generate AI analysis for a feasibility report
   */
  async generateReport(input: AIReportInput): Promise<AIReportOutput> {
    try {
      const prompt = this.buildPrompt(input)

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business feasibility expert specializing in location intelligence and retail analysis. Provide concise, actionable insights in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content || '{}'
      const parsed = JSON.parse(content)

      return {
        executiveSummary: parsed.executiveSummary || 'Unable to generate summary.',
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        recommendation: parsed.recommendation || 'Unable to generate recommendation.',
        disclaimer: 'This analysis is based on available data and should be used as decision support only. Conduct additional on-site research before making final decisions.',
      }
    } catch (error) {
      console.error('Error generating AI report:', error)
      return this.getFallbackReport(input)
    }
  }

  /**
   * Build the prompt for OpenAI
   */
  private buildPrompt(input: AIReportInput): string {
    const financialSection = input.financialData
      ? `
Financial Data:
- Rent: $${input.financialData.rent?.toLocaleString() || 'N/A'}
- Shop Size: ${input.financialData.shopSize || 'N/A'} sq ft
- Setup Budget: $${input.financialData.setupBudget?.toLocaleString() || 'N/A'}
- Monthly Staff Cost: $${input.financialData.staffCost?.toLocaleString() || 'N/A'}
- Inventory Cost: $${input.financialData.inventoryCost?.toLocaleString() || 'N/A'}
`
      : ''

    return `
Analyze the feasibility of opening a ${input.businessCategory} business (${input.businessModel}) at ${input.location} within a ${input.radius}m radius.

Scores (0-100 scale):
- Competition Score: ${input.competitionScore}
- Demand Score: ${input.demandScore}
- Accessibility Score: ${input.accessibilityScore}
- Area Fit Score: ${input.areaFitScore}
- Financial Pressure Score: ${input.financialPressureScore}
- Overall Confidence: ${input.confidence}%

Market Analysis:
- Competitors Found: ${input.competitorCount}
- Demand Signals: ${input.demandSignalCount}
${financialSection}

Return a JSON object with:
{
  "executiveSummary": "2-3 sentences summarizing the situation",
  "opportunities": ["string", "string", "string"],
  "risks": ["string", "string", "string"],
  "recommendation": "1-2 sentences with the final verdict"
}
`
  }

  /**
   * Get a fallback report if AI generation fails
   */
  private getFallbackReport(input: AIReportInput): AIReportOutput {
    const executiveSummary = `Based on the analysis of ${input.location}, the ${input.businessCategory} business shows ${input.confidence > 50 ? 'promising' : 'challenging'} potential with a confidence score of ${input.confidence}%.`
    
    const opportunities = [
      input.demandScore > 50 ? `Strong demand signals (${input.demandSignalCount} indicators) support business viability.` : 'Market shows moderate demand potential.',
      input.competitionScore > 50 ? `Limited competition (${input.competitorCount} competitors) provides opportunity for market entry.` : 'Competition exists but differentiation is possible.',
      input.accessibilityScore > 50 ? `Good accessibility for customers and suppliers.` : 'Accessibility may need improvement.',
    ]

    const risks = [
      input.competitionScore < 50 ? `High competition (${input.competitorCount} competitors) may impact market share.` : 'Moderate competitive landscape.',
      input.financialPressureScore < 50 ? 'Financial pressure requires careful budgeting and cash flow management.' : 'Financials appear manageable.',
      input.confidence < 50 ? 'Lower confidence score indicates additional research recommended.' : 'Good confidence in analysis results.',
    ]

    const recommendation = input.confidence > 60
      ? `Proceed with ${input.businessCategory} at ${input.location} with recommended due diligence.`
      : `Consider alternative locations or gather more data before proceeding with ${input.businessCategory} at ${input.location}.`

    return {
      executiveSummary,
      opportunities,
      risks,
      recommendation,
      disclaimer: 'This analysis is based on available data and should be used as decision support only. Conduct additional on-site research before making final decisions.',
    }
  }
}

export const aiReportService = new AIReportService()
