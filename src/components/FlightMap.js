/* eslint-disable no-undef */
import { Box } from '@mui/material'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for missing marker icons with webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

// Define a custom icon for the selected flight's markers
const selectedIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const FlightMap = ({ flight, flights }) => {
  const flightsArray = flight ? [flight] : flights || []

  const [airportData, setAirportData] = useState({})

  useEffect(() => {
    fetch('/airports.json')
      .then(res => res.json())
      .then(data => {
        // Build a lookup dictionary keyed by IATA code (uppercase)
        const lookup = {}
        data.forEach(airport => {
          if (airport.iata_code && airport._geoloc) {
            lookup[airport.iata_code.toUpperCase()] = [
              parseFloat(airport._geoloc.lat),
              parseFloat(airport._geoloc.lng),
            ]
          }
        })
        setAirportData(lookup)
      })
      .catch(error => console.error('Error fetching airport data:', error))
  }, [])

  const markers = []
  const polylines = []

  // Build routes for each flight’s legs & segments
  flightsArray.forEach(flight => {
    flight.legs?.forEach(leg => {
      let route = []
      if (leg.segments && leg.segments.length > 0) {
        leg.segments.forEach(segment => {
          const originCode = segment.origin.displayCode?.toUpperCase()
          const destCode = segment.destination.displayCode?.toUpperCase()
          const originCoord = airportData[originCode]
          const destCoord = airportData[destCode]
          if (originCoord) {
            if (route.length === 0) {
              route.push(originCoord)
              markers.push({
                position: originCoord,
                popup: `${segment.origin.name} (${originCode})`,
              })
            }
          }
          if (destCoord) {
            route.push(destCoord)
            markers.push({
              position: destCoord,
              popup: `${segment.destination.name} (${destCode})`,
            })
          }
        })
      } else {
        // Fallback: use leg's origin and destination
        const originCode = leg.origin.displayCode?.toUpperCase()
        const destCode = leg.destination.displayCode?.toUpperCase()
        const originCoord = airportData[originCode]
        const destCoord = airportData[destCode]
        if (originCoord && destCoord) {
          route.push(originCoord, destCoord)
          markers.push({
            position: originCoord,
            popup: `${leg.origin.name} (${originCode})`,
          })
          markers.push({
            position: destCoord,
            popup: `${leg.destination.name} (${destCode})`,
          })
        }
      }
      if (route.length > 0) {
        polylines.push(route)
      }
    })
  })

  // Use the first marker as center, if available
  const center = markers.length > 0 ? markers[0].position : [20, 0]

  // Remove duplicate markers (by position)
  const uniqueMarkersMap = new Map()
  markers.forEach(marker => {
    uniqueMarkersMap.set(JSON.stringify(marker.position), marker)
  })
  const uniqueMarkers = Array.from(uniqueMarkersMap.values())

  // Highlight the selected flight with a red polyline; default to blue otherwise.
  const polylineColor = flight ? 'red' : 'blue'

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            detectRetina={true}
          />
          {uniqueMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={flight ? selectedIcon : undefined} // Use custom icon if selected flight
            >
              <Popup>{marker.popup}</Popup>
            </Marker>
          ))}
          {polylines.map((route, index) => (
            <Polyline key={index} positions={route} color={polylineColor} />
          ))}
        </MapContainer>
      </div>
    </Box>
  )
}

export default FlightMap
