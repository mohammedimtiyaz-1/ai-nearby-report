'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api'
import { env } from '@/lib/config/env'

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.75rem'
}

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
}

interface LocationPickerMapProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

export default function LocationPickerMap({ onLocationSelect, initialLocation }: LocationPickerMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(
    initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : defaultCenter
  )
  const [address, setAddress] = useState(initialLocation?.address || '')
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete
  }

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry && place.geometry.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        setMarkerPosition(newPos)
        setAddress(place.formatted_address || '')
        map?.panTo(newPos)
        map?.setZoom(18)
      }
    }
  }

  const onMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
      setMarkerPosition(newPos)
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          setAddress(results[0].formatted_address)
        }
      })
    }
  }

  const handleConfirm = () => {
    onLocationSelect({
      address,
      lat: markerPosition.lat,
      lng: markerPosition.lng
    })
  }

  if (!isLoaded) return <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-500">Loading Map...</div>

  return (
    <div className="space-y-4">
      <div className="relative">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a specific location..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white mb-4"
            defaultValue={address}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
        </Autocomplete>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={initialLocation ? 18 : 13}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
        >
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            animation={google.maps.Animation.DROP}
          />
        </GoogleMap>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900 mb-1">Selected Location Precision:</p>
          <p className="text-xs text-amber-800 line-clamp-1">{address || 'No address selected'}</p>
          <p className="text-[10px] text-amber-700 mt-1 font-mono">
            {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!address}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 whitespace-nowrap shadow-md transition-all active:scale-95"
        >
          Confirm Location
        </button>
      </div>
      <p className="text-center text-[11px] text-gray-400 italic">
        Tip: Drag the marker to pinpoint the exact storefront or entrance (10-20m precision)
      </p>
    </div>
  )
}
