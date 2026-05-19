'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LocationPickerMap from '@/components/LocationPickerMap'

const recommendationSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.string().min(1, 'Radius is required'),
})

type RecommendationFormData = z.infer<typeof recommendationSchema>

function RecommendationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const selectedLocation = watch('location')

  const handleLocationSelect = (data: { address: string; lat: number; lng: number }) => {
    setValue('location', data.address)
    setValue('latitude', data.lat)
    setValue('longitude', data.lng)
    setStep(2)
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
      setResult({ ...recommendation, location: data.location })
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

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          {!result && (
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {step === 1 ? 'Pinpoint Location' : 'Analysis Settings'}
                </h1>
                <p className="text-gray-600">
                  {step === 1 
                    ? 'Where do you want to start a business? Select the exact spot for precision.' 
                    : `Finding the best business gap for ${selectedLocation}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
                <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
              </div>
            </div>
          )}

          {!result ? (
            step === 1 ? (
              <LocationPickerMap onLocationSelect={handleLocationSelect} />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius *</label>
                    <select
                      {...register('radius')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    >
                      <option value="500">500m (Highly targeted)</option>
                      <option value="1000">1km (Standard walkability)</option>
                      <option value="2000">2km (Broad catchment)</option>
                      <option value="3000">3km (Regional area)</option>
                    </select>
                    {errors.radius && <p className="mt-1 text-xs text-red-600">{errors.radius.message}</p>}
                    <p className="mt-1 text-xs text-gray-500">A smaller radius (500m-1km) is better for high-precision local gap analysis.</p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                      {loading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {loading ? 'Analyzing Market Gaps...' : 'Get AI Recommendation'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Change Location
                    </button>
                  </div>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 text-center">
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">Best Opportunity Found</p>
                <h2 className="text-5xl font-black text-gray-900 capitalize mb-4 tracking-tight">{result.suggestedCategory}</h2>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">AI Confidence Level:</span>
                  <div className="flex items-center bg-white px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                    <div className={`h-2 w-2 rounded-full mr-2 ${result.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    <span className={`text-lg font-black ${result.confidence > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {result.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Market Analysis
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 border border-gray-100 p-6 rounded-xl italic font-medium italic">
                  "{result.analysis}"
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Competitor Landscape (Nearby)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(result.competitorCounts || {}).map(([cat, count]: [string, any]) => (
                    <div key={cat} className="bg-white border border-gray-100 p-4 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">{cat}</p>
                      <p className="text-3xl font-black text-gray-900">{count}</p>
                      <p className="text-[9px] text-gray-400 font-medium">COMPETITORS</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gray-100">
                <button
                  onClick={() => {
                    setResult(null)
                    setStep(1)
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Try Another Spot
                </button>
                <a
                  href={`/reports/new?location=${encodeURIComponent(result.location)}&category=${result.suggestedCategory}`}
                  className="w-full flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 text-center shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Launch Detailed Feasibility Report
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
