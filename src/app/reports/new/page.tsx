'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const reportSchema = z.object({
  businessCategory: z.string().min(1, 'Business category is required'),
  businessModel: z.string().min(1, 'Business model is required'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.string().min(1, 'Radius is required'),
  rent: z.string().optional(),
  shopSize: z.string().optional(),
  setupBudget: z.string().optional(),
  staffCost: z.string().optional(),
  inventoryCost: z.string().optional(),
})

type ReportFormData = z.infer<typeof reportSchema>

interface Category {
  id: string
  name: string
  models: string[]
}

export default function NewReportPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [locationResults, setLocationResults] = useState<any[]>([])
  const [searchingLocation, setSearchingLocation] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      radius: '1000',
      latitude: 0,
      longitude: 0,
    }
  })

  const selectedCategory = watch('businessCategory')
  const locationQuery = watch('location')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery && locationQuery.length >= 3 && !searchingLocation) {
        searchLocations(locationQuery)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [locationQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/business-categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories')
    }
  }

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

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          radius: parseInt(data.radius),
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create report')
      }

      const report = await response.json()
      router.push(`/reports/${report.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report')
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

      {/* Form Container */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Feasibility Report</h1>
          <p className="text-gray-600 mb-8">Select your business type and location to generate insights</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Business Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
                  <select
                    {...register('businessCategory')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.businessCategory && <p className="mt-1 text-xs text-red-600">{errors.businessCategory.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Model *</label>
                  <select
                    {...register('businessModel')}
                    disabled={!selectedCategory}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                  >
                    <option value="">Select model</option>
                    {selectedCategoryData?.models.map(m => (
                      <option key={m} value={m} className="capitalize">{m}</option>
                    ))}
                  </select>
                  {errors.businessModel && <p className="mt-1 text-xs text-red-600">{errors.businessModel.message}</p>}
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Search *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Radius *</label>
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
              </div>
            </div>

            {/* Optional Financial Inputs */}
            <div className="mb-8">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 mb-4">
                  <span>Financial Information (Optional)</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rent</label>
                      <input
                        {...register('rent')}
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Size (sq ft)</label>
                      <input
                        {...register('shopSize')}
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Budget</label>
                    <input
                      {...register('setupBudget')}
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Staff Cost</label>
                      <input
                        {...register('staffCost')}
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Cost</label>
                      <input
                        {...register('inventoryCost')}
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Submit Section */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Analyzing Location...' : 'Generate Report'}
              </button>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
