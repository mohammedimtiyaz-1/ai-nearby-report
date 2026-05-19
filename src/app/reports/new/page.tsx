'use client'

import { useState } from 'react'

export default function NewReportPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessCategory: '',
    businessModel: '',
    location: '',
    latitude: 0,
    longitude: 0,
    radius: '1000',
    rent: '',
    shopSize: '',
    setupBudget: '',
    staffCost: '',
    inventoryCost: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: API call to create report
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

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

          {/* Progress Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Business Info</span>
              </div>
              <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
                <div className={`h-1 bg-indigo-600 rounded transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 2 ? '✓' : '2'}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Location</span>
              </div>
              <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
                <div className={`h-1 bg-indigo-600 rounded transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > 3 ? '✓' : '3'}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>Complete</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Business Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
                  <select
                    required
                    value={formData.businessCategory}
                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select category</option>
                    <option value="cafe">Cafe</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="salon">Salon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Model *</label>
                  <select
                    required
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select model</option>
                    <option value="independent">Independent</option>
                    <option value="franchise">Franchise</option>
                    <option value="chain">Chain</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Select the operating model for your business</p>
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Search *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter address or place name"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Radius *</label>
                  <select
                    required
                    value={formData.radius}
                    onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="500">500m</option>
                    <option value="1000">1km</option>
                    <option value="2000">2km</option>
                    <option value="3000">3km</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Adjust the pin for precise location</p>
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
                        type="number"
                        placeholder="0"
                        value={formData.rent}
                        onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Size (sq ft)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.shopSize}
                        onChange={(e) => setFormData({ ...formData, shopSize: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Budget</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.setupBudget}
                      onChange={(e) => setFormData({ ...formData, setupBudget: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Staff Cost</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.staffCost}
                        onChange={(e) => setFormData({ ...formData, staffCost: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Cost</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.inventoryCost}
                        onChange={(e) => setFormData({ ...formData, inventoryCost: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Skip these if you want manual financial validation</p>
                </div>
              </details>
            </div>

            {/* Submit Section */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Save as Draft
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
