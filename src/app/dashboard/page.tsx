'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

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

export default function DashboardPage() {
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchReports()
    }
  }, [session])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/reports')
      if (!response.ok) throw new Error('Failed to fetch reports')
      const data = await response.json()
      setReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports')
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Reports</h1>
            <p className="text-gray-600 text-lg">Manage and analyze your location feasibility reports</p>
          </div>
          <a
            href="/reports/new"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-sm"
          >
            Create New Report
          </a>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No reports yet</p>
            <a
              href="/reports/new"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Create your first report
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {report.scoreCard && (
                  <div className="mb-4">
                    <div className={`text-3xl font-bold ${getScoreColor(report.confidence)}`}>
                      {report.confidence}%
                    </div>
                    <p className="text-gray-600 text-sm">Confidence Score</p>
                  </div>
                )}

                {/* Location */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">{report.location}</p>
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
      </div>
    </div>
  )
}
