import type { ReportPOI, ScoreCard } from '@prisma/client'

export interface ScoringInput {
  pois: ReportPOI[]
  financialData?: {
    rent?: number
    shopSize?: number
    setupBudget?: number
    staffCost?: number
    inventoryCost?: number
  }
}

export interface ScoringResult {
  competitionScore: number
  demandScore: number
  accessibilityScore: number
  areaFitScore: number
  financialPressureScore: number
  confidence: number
  reasons: {
    competition: string
    demand: string
    accessibility: string
    areaFit: string
    financialPressure: string
  }
}

export class ScoringEngine {
  /**
   * Calculate competition score based on nearby competitors
   * Higher score = less competition (better)
   */
  private calculateCompetitionScore(pois: ReportPOI[]): { score: number; reason: string } {
    const competitors = pois.filter(poi => poi.type === 'competitor_direct' || poi.type === 'competitor_indirect')
    const directCompetitors = competitors.filter(poi => poi.type === 'competitor_direct').length
    const indirectCompetitors = competitors.filter(poi => poi.type === 'competitor_indirect').length

    // Base score starts at 100, decreases with competitors
    let score = 100
    score -= directCompetitors * 15 // Direct competitors have higher impact
    score -= indirectCompetitors * 5 // Indirect competitors have lower impact
    score = Math.max(0, Math.min(100, score))

    const reason = `Found ${directCompetitors} direct and ${indirectCompetitors} indirect competitors in the area. ${score > 70 ? 'Low competition indicates good opportunity.' : score > 40 ? 'Moderate competition - differentiation will be key.' : 'High competition - consider alternative location.'}`

    return { score, reason }
  }

  /**
   * Calculate demand score based on demand signals
   * Higher score = higher demand (better)
   */
  private calculateDemandScore(pois: ReportPOI[]): { score: number; reason: string } {
    const demandSignals = pois.filter(poi => poi.type === 'demand_signal')
    const demandCount = demandSignals.length

    // Score based on number of demand signals
    let score = Math.min(100, demandCount * 10)
    score = Math.max(0, score)

    const reason = `Identified ${demandCount} demand signals in the area. ${score > 70 ? 'Strong demand indicators support business viability.' : score > 40 ? 'Moderate demand - consider target marketing.' : 'Limited demand signals - may need to create demand.'}`

    return { score, reason }
  }

  /**
   * Calculate accessibility score based on accessibility indicators
   * Higher score = better accessibility (better)
   */
  private calculateAccessibilityScore(pois: ReportPOI[]): { score: number; reason: string } {
    const accessibilityIndicators = pois.filter(poi => poi.type === 'accessibility_indicator')
    const accessibilityCount = accessibilityIndicators.length

    // Score based on accessibility indicators
    let score = Math.min(100, accessibilityCount * 15)
    score = Math.max(0, score)

    const reason = `Found ${accessibilityCount} accessibility indicators (transportation, parking, etc.). ${score > 70 ? 'Excellent accessibility for customers.' : score > 40 ? 'Moderate accessibility - consider visibility.' : 'Limited accessibility - may impact foot traffic.'}`

    return { score, reason }
  }

  /**
   * Calculate area fit score based on business category and area characteristics
   * Higher score = better fit (better)
   */
  private calculateAreaFitScore(pois: ReportPOI[]): { score: number; reason: string } {
    // Simplified scoring - in real implementation, this would analyze area demographics
    const commercialPois = pois.filter(poi => poi.category === 'commercial')
    const residentialPois = pois.filter(poi => poi.category === 'residential')
    
    let score = 50 // Base score
    score += Math.min(25, commercialPois.length * 5) // Commercial activity
    score += Math.min(25, residentialPois.length * 3) // Residential density
    score = Math.min(100, score)

    const reason = `Area analysis shows ${commercialPois.length} commercial and ${residentialPois.length} residential points. ${score > 70 ? 'Strong fit for business category.' : score > 40 ? 'Moderate fit - consider target audience.' : 'Limited fit - may need location adjustment.'}`

    return { score, reason }
  }

  /**
   * Calculate financial pressure score based on costs vs budget
   * Higher score = lower pressure (better)
   */
  private calculateFinancialPressureScore(financialData?: ScoringInput['financialData']): { score: number; reason: string } {
    if (!financialData || !financialData.rent || !financialData.setupBudget) {
      return { score: 50, reason: 'Financial data not provided - manual validation recommended.' }
    }

    const monthlyBurnRate = (financialData.rent || 0) + (financialData.staffCost || 0)
    const totalInvestment = (financialData.setupBudget || 0) + (financialData.inventoryCost || 0)
    const monthlyRevenueTarget = monthlyBurnRate * 2 // 2x revenue target for profitability

    let score = 100
    if (totalInvestment > 0 && financialData.setupBudget) {
      const setupRatio = totalInvestment / financialData.setupBudget
      score -= (setupRatio - 1) * 20 // Penalize if investment exceeds budget
    }
    score = Math.max(0, Math.min(100, score))

    const reason = `Monthly burn rate: $${monthlyBurnRate.toLocaleString()}, Total investment: $${totalInvestment.toLocaleString()}. ${score > 70 ? 'Financial pressure is manageable.' : score > 40 ? 'Moderate financial pressure - careful planning needed.' : 'High financial pressure - reconsider budget.'}`

    return { score, reason }
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(scores: ScoringResult): number {
    const { competitionScore, demandScore, accessibilityScore, areaFitScore, financialPressureScore } = scores
    const average = (competitionScore + demandScore + accessibilityScore + areaFitScore + financialPressureScore) / 5
    return Math.round(average)
  }

  /**
   * Main scoring function
   */
  public calculateScores(input: ScoringInput): ScoringResult {
    const competition = this.calculateCompetitionScore(input.pois)
    const demand = this.calculateDemandScore(input.pois)
    const accessibility = this.calculateAccessibilityScore(input.pois)
    const areaFit = this.calculateAreaFitScore(input.pois)
    const financialPressure = this.calculateFinancialPressureScore(input.financialData)

    const result: ScoringResult = {
      competitionScore: competition.score,
      demandScore: demand.score,
      accessibilityScore: accessibility.score,
      areaFitScore: areaFit.score,
      financialPressureScore: financialPressure.score,
      confidence: 0, // Will be calculated
      reasons: {
        competition: competition.reason,
        demand: demand.reason,
        accessibility: accessibility.reason,
        areaFit: areaFit.reason,
        financialPressure: financialPressure.reason,
      },
    }

    result.confidence = this.calculateConfidence(result)

    return result
  }
}

export const scoringEngine = new ScoringEngine()
