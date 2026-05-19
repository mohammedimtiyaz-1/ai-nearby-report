'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const recommendationSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.string().min(1, 'Radius is required'),
})

type RecommendationFormData = z.infer<typeof recommendationSchema>

function RecommendationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationResults, setLocationResults] = useState<any[]>([])
  const [searchingLocation, setSearchingLocation] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      radius: '1000',
      latitude: 0,
      longitude: 0,
    }
  })

  const locationQuery = watch('location')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery && locationQuery.length >= 3 && !searchingLocation && !result) {
        searchLocations(locationQuery)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [locationQuery])

  const searchLocations = async (query: string) => {
    setSearchingLocation(true)
    try {
      const response = await fetch(`/api/v1/locations/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setLocationResults(data.places || [])
    } catch (err) {
      console.error('Location search failed')
    } finally {
      setSearchingLocation(false)
    }
  }

  const handleSelectLocation = (place: any) => {
    setValue('location', place.address)
    setValue('latitude', place.latitude)
    setValue('longitude', place.longitude)
    setLocationResults([])
  }

  const onSubmit = async (data: RecommendationFormData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/v1/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          radius: parseInt(data.radius),
        }),
      })

      if (!response.ok) {
        const resData = await response.json()
        throw new Error(resData.error || 'Failed to generate recommendation')
      }

      const recommendation = await response.json()
      setResult(recommendation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Nearby Report</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What should I open here?</h1>
          <p className="text-gray-600 mb-8">AI-powered market gap analysis to suggest the best business for a location.</p>

          {!result ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick a Location *</label>
                  <input
                    {...register('location')}
                    type="text"
                    placeholder="Enter address or place name"
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {searchingLocation && (
                    <div className="absolute right-3 top-10">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  {locationResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {locationResults.map((place) => (
                        <div
                          key={place.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                          onClick={() => handleSelectLocation(place)}
                        >
                          <div className="font-medium">{place.name}</div>
                          <div className="text-xs opacity-75">{place.address}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius *</label>
                  <select
                    {...register('radius')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="500">500m</option>
                    <option value="1000">1km</option>
                    <option value="2000">2km</option>
                    <option value="3000">3km</option>
                  </select>
                  {errors.radius && <p className="mt-1 text-xs text-red-600">{errors.radius.message}</p>}
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 flex items-center justify-center"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Analyzing Market Gaps...' : 'Get Recommendation'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">Best Opportunity</p>
                <h2 className="text-4xl font-bold text-gray-900 capitalize mb-4">{result.suggestedCategory}</h2>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-gray-600 text-sm font-medium">Confidence:</span>
                  <span className={`text-lg font-bold ${result.confidence > 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analysis</h3>
                <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-4 rounded-lg">
                  {result.analysis}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Density</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(result.competitorData || {}).map(([cat, count]: [string, any]) => (
                    <div key={cat} className="bg-white border border-gray-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">{cat}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-[10px] text-gray-400">Competitors</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Try Another Location
                </button>
                <a
                  href={`/reports/new?location=${encodeURIComponent(result.location)}&category=${result.suggestedCategory}`}
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-center"
                >
                  Create Detailed Report
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewRecommendationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecommendationForm />
    </Suspense>
  )
}
