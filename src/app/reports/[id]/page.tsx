'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { pdfExportService } from '@/lib/services/pdf-export'

interface Report {
  id: string
  businessCategoryId: string
  businessModel: string
  location: string
  radius: number
  status: string
  confidence: number
  createdAt: string
  scoreCard?: {
    competitionScore: number
    demandScore: number
    accessibilityScore: number
    areaFitScore: number
    financialPressureScore: number
    competitionReason: string
    demandReason: string
    accessibilityReason: string
    areaFitReason: string
    financialPressureReason: string
  }
  pois?: Array<{
    id: string
    name: string
    type: string
    category?: string
    address?: string
    rating?: number
  }>
  surveyChecklist?: Array<{
    id: string
    task: string
    completed: boolean
    notes?: string
  }>
}

interface AIReport {
  executiveSummary: string
  opportunities: string[]
  risks: string[]
  recommendation: string
  disclaimer: string
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [aiReport, setAiReport] = useState<AIReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [params.id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/reports/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) throw new Error('Report not found')
        throw new Error('Failed to load report')
      }
      const data = await response.json()
      setReport(data.report)
      
      // If report has scoreCard, construct AI report from it
      if (data.report.scoreCard) {
        setAiReport({
          executiveSummary: `Based on the analysis of ${data.report.location}, the ${data.report.businessCategoryId.replace('_', ' ')} business shows ${data.report.confidence > 50 ? 'promising' : 'challenging'} potential with a confidence score of ${data.report.confidence}%.`,
          opportunities: [
            data.report.scoreCard.demandReason,
            data.report.scoreCard.competitionReason,
            data.report.scoreCard.accessibilityReason,
          ],
          risks: [
            data.report.scoreCard.financialPressureReason,
            data.report.scoreCard.areaFitReason,
            'Additional on-site research recommended before final decision.',
          ],
          recommendation: data.report.confidence > 60
            ? `Proceed with ${data.report.businessCategoryId.replace('_', ' ')} at ${data.report.location} with recommended due diligence.`
            : `Consider alternative locations or gather more data before proceeding with ${data.report.businessCategoryId.replace('_', ' ')} at ${data.report.location}.`,
          disclaimer: 'This analysis is based on available data and should be used as decision support only. Conduct additional on-site research before making final decisions.',
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!report || !aiReport) return
    
    setGeneratingPDF(true)
    try {
      const pdfBlob = await pdfExportService.generateReport({
        businessCategory: report.businessCategoryId,
        businessModel: report.businessModel,
        location: report.location,
        radius: report.radius,
        status: report.status,
        confidence: report.confidence,
        createdAt: report.createdAt,
        scoreCard: report.scoreCard || {
          competitionScore: 0,
          demandScore: 0,
          accessibilityScore: 0,
          areaFitScore: 0,
          financialPressureScore: 0,
          competitionReason: '',
          demandReason: '',
          accessibilityReason: '',
          areaFitReason: '',
          financialPressureReason: '',
        },
        aiReport: aiReport,
        pois: report.pois || [],
      })

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `feasibility-report-${report.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleChecklistToggle = (taskId: string) => {
    if (!report) return
    setReport({
      ...report,
      surveyChecklist: report.surveyChecklist?.map(item =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      ),
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    if (score >= 35) return 'text-red-600'
    return 'text-red-800'
  }

  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return 'Strong potential based on available signals'
    if (score >= 65) return 'Good potential with some considerations'
    if (score >= 50) return 'Moderate potential - requires careful planning'
    if (score >= 35) return 'Limited potential - consider alternatives'
    return 'Weak potential - not recommended'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-600">Nearby Report</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Back to Dashboard</a>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-600">Nearby Report</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Back to Dashboard</a>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <a href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg font-bold text-indigo-600">Nearby Report</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Back to Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Report Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            {report.businessCategoryId.replace('_', ' ')}
          </h1>
          <p className="text-gray-600 text-lg mb-4">{report.location}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span>Radius: {report.radius}m</span>
            <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              report.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {report.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPDF}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feasibility Scores</h2>
          {report.scoreCard && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Competition</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.scoreCard.competitionScore)}`}>
                    {report.scoreCard.competitionScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{report.scoreCard.competitionReason}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Demand</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.scoreCard.demandScore)}`}>
                    {report.scoreCard.demandScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{report.scoreCard.demandReason}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Accessibility</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.scoreCard.accessibilityScore)}`}>
                    {report.scoreCard.accessibilityScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{report.scoreCard.accessibilityReason}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Area Fit</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.scoreCard.areaFitScore)}`}>
                    {report.scoreCard.areaFitScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{report.scoreCard.areaFitReason}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Financial Pressure</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.scoreCard.financialPressureScore)}`}>
                    {report.scoreCard.financialPressureScore}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{report.scoreCard.financialPressureReason}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Confidence</p>
                  <p className={`text-2xl font-bold ${getScoreColor(report.confidence)}`}>
                    {report.confidence}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Overall confidence score</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className={`text-4xl font-bold ${getScoreColor(report.confidence)} mb-2`}>
                  {report.confidence}%
                </p>
                <p className="text-gray-700">{getScoreInterpretation(report.confidence)}</p>
              </div>
            </>
          )}
        </div>

        {/* AI Summary Section */}
        {aiReport && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Executive Summary</h3>
              <p className="text-gray-700">{aiReport.executiveSummary}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-green-700 mb-2">Opportunities</h3>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                {aiReport.opportunities.map((opportunity, idx) => (
                  <li key={idx}>{opportunity}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-medium text-red-700 mb-2">Risks</h3>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {aiReport.risks.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-600 text-white p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Recommendation</h3>
              <p>{aiReport.recommendation}</p>
            </div>
            <p className="text-xs text-gray-500">{aiReport.disclaimer}</p>
          </div>
        )}

        {/* Survey Checklist Section */}
        {report.surveyChecklist && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Physical Survey Checklist</h2>
            <div className="space-y-3">
              {report.surveyChecklist.map((item) => (
                <label key={item.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(item.id)}
                    className="mt-1 w-5 h-5 text-indigo-600 rounded"
                  />
                  <div>
                    <p className="text-gray-900">{item.task}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {report.surveyChecklist.filter(c => c.completed).length} of {report.surveyChecklist.length} tasks completed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
