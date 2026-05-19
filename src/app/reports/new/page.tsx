'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import LocationPickerMap from '@/components/LocationPickerMap'

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
  specialConcerns: z.string().optional(),
})

type ReportFormData = z.infer<typeof reportSchema>

interface Category {
  id: string
  name: string
  models: string[]
}

function NewReportForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

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
      businessCategory: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
    }
  })

  const selectedCategory = watch('businessCategory')
  const selectedLocation = watch('location')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/business-categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories')
    }
  }

  const handleLocationSelect = (data: { address: string; lat: number; lng: number }) => {
    setValue('location', data.address)
    setValue('latitude', data.lat)
    setValue('longitude', data.lng)
    setStep(2)
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
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {step === 1 ? 'Pinpoint Location' : 'Report Details'}
              </h1>
              <p className="text-gray-600">
                {step === 1 
                  ? 'Use the map to select the exact spot for your business (10-20m precision)' 
                  : `Feasibility analysis for ${selectedLocation}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <div className={`h-2 w-12 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
              <div className={`h-2 w-12 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
            </div>
          </div>

          {step === 1 ? (
            <LocationPickerMap 
              onLocationSelect={handleLocationSelect} 
              initialLocation={searchParams.get('location') ? { 
                lat: 0, // Will be handled by geocoder in component if only address provided
                lng: 0,
                address: searchParams.get('location') || '' 
              } : undefined}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Business Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
                    <select
                      {...register('businessCategory')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 text-gray-900 bg-white"
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

              {/* Parameters */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Analysis Parameters</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Radius *</label>
                  <select
                    {...register('radius')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  >
                    <option value="500">500m (Highly targeted)</option>
                    <option value="1000">1km (Standard)</option>
                    <option value="2000">2km (Broad)</option>
                    <option value="3000">3km (Regional)</option>
                  </select>
                  {errors.radius && <p className="mt-1 text-xs text-red-600">{errors.radius.message}</p>}
                  <p className="mt-1 text-xs text-gray-500">Since you've picked a precise spot, a 500m radius is recommended for specific feasibility.</p>
                </div>
              </div>

              {/* Optional Financial Inputs */}
              <div className="mb-8">
                <details className="group border border-gray-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span>Financial Information (Optional)</span>
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="space-y-4 p-6 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rent</label>
                        <input
                          {...register('rent')}
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Size (sq ft)</label>
                        <input
                          {...register('shopSize')}
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Setup Budget</label>
                      <input
                        {...register('setupBudget')}
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Staff Cost</label>
                        <input
                          {...register('staffCost')}
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Cost</label>
                        <input
                          {...register('inventoryCost')}
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Special Concerns */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Concerns (Optional)</label>
                <textarea
                  {...register('specialConcerns')}
                  rows={4}
                  placeholder="Any specific concerns or requirements you want the analysis to address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white placeholder-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500">Describe any special concerns, requirements, or specific aspects you want the feasibility analysis to focus on.</p>
              </div>

              {/* Submit Section */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all active:scale-95"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Analyzing Location...' : 'Generate Feasibility Report'}
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Change Location
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewReportForm />
    </Suspense>
  )
}
