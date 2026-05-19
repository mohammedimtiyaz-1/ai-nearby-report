'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Report {
  id: string
  businessCategoryId: string
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
  }
}

interface Recommendation {
  id: string
  location: string
  suggestedCategory: string
  confidence: number
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportsRes, recsRes] = await Promise.all([
        fetch('/api/v1/reports'),
        fetch('/api/v1/recommendations')
      ])

      if (!reportsRes.ok || !recsRes.ok) throw new Error('Failed to fetch dashboard data')
      
      const reportsData = await reportsRes.json()
      const recsData = await recsRes.json()
      
      setReports(reportsData.reports || [])
      setRecommendations(recsData.recommendations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED_WITH_WARNINGS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COLLECTING_DATA':
      case 'CLASSIFYING':
      case 'SCORING':
      case 'AI_GENERATING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    if (score >= 35) return 'text-red-600'
    return 'text-red-800'
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
              <div className="flex items-center space-x-4 text-sm">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/reports/new" className="text-gray-600 hover:text-gray-900">Create Report</a>
                <button onClick={handleSignOut} className="text-red-600 hover:text-red-700">Sign out</button>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg font-bold text-indigo-600">Nearby Report</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <a href="/dashboard" className="text-gray-900 font-medium">Dashboard</a>
                <a href="/reports/new" className="text-gray-600 hover:text-gray-900">Create Report</a>
                <Link href="/recommendations/new" className="text-gray-600 hover:text-gray-900 font-semibold text-indigo-600 italic">
                  Suggest a Business ✨
                </Link>
              </div>
              <div className="flex items-center pl-6 border-l border-gray-200 space-x-4">
                <span className="text-sm text-gray-500">{session?.user?.name}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Recommendation CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 mb-12 shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Not sure what business to start?</h2>
            <p className="text-indigo-100 opacity-90 text-lg">Use our AI to find the perfect business for your chosen location.</p>
          </div>
          <Link
            href="/recommendations/new"
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Ask AI: What should I open here?
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detailed Feasibility Reports</h1>
            <p className="text-gray-600 text-lg">In-depth analysis for specific business types</p>
          </div>
          <a
            href="/reports/new"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 font-semibold rounded-lg hover:bg-indigo-50 transition-all shadow-sm"
          >
            New Detailed Report
          </a>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-12">
            <p className="text-gray-600 mb-4">No detailed reports yet</p>
            <a
              href="/reports/new"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Create your first report
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {report.businessCategoryId.replace('_', ' ')}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Score */}
                <div className="mb-4">
                  <div className={`text-3xl font-bold ${getScoreColor(report.confidence)}`}>
                    {report.confidence}%
                  </div>
                  <p className="text-gray-600 text-sm">Confidence Score</p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm truncate">{report.location}</p>
                  <p className="text-gray-400 text-xs">Radius: {report.radius}m</p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-gray-400 text-xs">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <a
                    href={`/reports/${report.id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                  >
                    View details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent AI Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Suggested</span>
                    <span className="text-xs text-gray-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 capitalize mb-1">{rec.suggestedCategory}</h4>
                  <p className="text-gray-500 text-sm truncate mb-3">{rec.location}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-400">Match:</span>
                      <span className="text-sm font-bold text-green-600">{rec.confidence}%</span>
                    </div>
                    <Link 
                      href={`/reports/new?location=${encodeURIComponent(rec.location)}&category=${rec.suggestedCategory}`}
                      className="text-indigo-600 text-xs font-bold hover:underline"
                    >
                      Analyze Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

