import { NextResponse } from 'next/server'

export async function GET() {
  const categories = [
    {
      id: 'cafe',
      name: 'Cafe',
      description: 'Coffee shops, bakeries, and tea houses',
      models: ['independent', 'franchise', 'chain'],
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      description: 'Retail pharmacies and drugstores',
      models: ['independent', 'franchise'],
    },
    {
      id: 'salon',
      name: 'Salon',
      description: 'Hair care, beauty salons, and spas',
      models: ['independent', 'franchise'],
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Full-service restaurants and fast food',
      models: ['independent', 'franchise', 'chain'],
    },
    {
      id: 'retail',
      name: 'Retail Store',
      description: 'General retail and specialty stores',
      models: ['independent', 'franchise', 'chain'],
    },
  ]

  return NextResponse.json({ categories })
}
