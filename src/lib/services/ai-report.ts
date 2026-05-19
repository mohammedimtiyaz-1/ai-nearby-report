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
            content: 'You are a business feasibility expert specializing in location intelligence and retail analysis. Provide concise, actionable insights.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content || ''

      return this.parseResponse(content)
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
- Competition Score: ${input.competitionScore} (${input.competitionScore > 70 ? 'Low competition' : input.competitionScore > 40 ? 'Moderate competition' : 'High competition'})
- Demand Score: ${input.demandScore} (${input.demandScore > 70 ? 'Strong demand' : input.demandScore > 40 ? 'Moderate demand' : 'Limited demand'})
- Accessibility Score: ${input.accessibilityScore} (${input.accessibilityScore > 70 ? 'Excellent' : input.accessibilityScore > 40 ? 'Good' : 'Limited'})
- Area Fit Score: ${input.areaFitScore} (${input.areaFitScore > 70 ? 'Strong fit' : input.areaFitScore > 40 ? 'Moderate fit' : 'Limited fit'})
- Financial Pressure Score: ${input.financialPressureScore} (${input.financialPressureScore > 70 ? 'Low pressure' : input.financialPressureScore > 40 ? 'Moderate pressure' : 'High pressure'})
- Overall Confidence: ${input.confidence}%

Market Analysis:
- Competitors Found: ${input.competitorCount}
- Demand Signals: ${input.demandSignalCount}
${financialSection}

Provide a structured analysis with:
1. Executive Summary (2-3 sentences)
2. Key Opportunities (3 bullet points)
3. Key Risks (3 bullet points)
4. Final Recommendation (1-2 sentences)

Format your response clearly with these sections.`
  }

  /**
   * Parse the AI response into structured output
   */
  private parseResponse(content: string): AIReportOutput {
    const lines = content.split('\n').filter(line => line.trim())
    
    let executiveSummary = ''
    const opportunities: string[] = []
    const risks: string[] = []
    let recommendation = ''

    let currentSection = 'summary'

    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('executive summary') || lowerLine.includes('summary:')) {
        currentSection = 'summary'
        continue
      }
      if (lowerLine.includes('opportunit')) {
        currentSection = 'opportunities'
        continue
      }
      if (lowerLine.includes('risk')) {
        currentSection = 'risks'
        continue
      }
      if (lowerLine.includes('recommendation')) {
        currentSection = 'recommendation'
        continue
      }

      if (currentSection === 'summary' && line.trim()) {
        executiveSummary += line.trim() + ' '
      } else if (currentSection === 'opportunities' && line.trim()) {
        const cleaned = line.replace(/^[-*•]\s*/, '').trim()
        if (cleaned) opportunities.push(cleaned)
      } else if (currentSection === 'risks' && line.trim()) {
        const cleaned = line.replace(/^[-*•]\s*/, '').trim()
        if (cleaned) risks.push(cleaned)
      } else if (currentSection === 'recommendation' && line.trim()) {
        recommendation += line.trim() + ' '
      }
    }

    return {
      executiveSummary: executiveSummary.trim() || 'Unable to generate executive summary.',
      opportunities: opportunities.length > 0 ? opportunities : ['No specific opportunities identified.'],
      risks: risks.length > 0 ? risks : ['No specific risks identified.'],
      recommendation: recommendation.trim() || 'Unable to generate specific recommendation.',
      disclaimer: 'This analysis is based on available data and should be used as decision support only. Conduct additional on-site research before making final decisions.',
    }
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
