import { Grid, Typography, Divider, Pagination, Box } from '@mui/material'
import { parseItineraries } from 'lib/helpers'
import { useMemo, useState } from 'react'
import useFilters from 'store/useFilters'
import useFlights from 'store/useFlights'

import FlightCard from './FlightCard'

const FlightSearch = ({ onSelectFlight, selectedFlight }) => {
  const { flights } = useFlights()
  const {
    maxDuration,
    maxPrice,
    airlines,
    sortBy,
    limit,
    cabinClass,
    adults,
    childrens,
    infants,
    returnDate,
  } = useFilters()

  const isFiltered = Boolean(
    maxDuration || maxPrice || airlines || sortBy || limit
  )
  let itineraries = useMemo(() => parseItineraries(flights), [flights])

  const itemsPerPage = 5
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(itineraries.length / itemsPerPage)

  const handleChangePage = value => setPage(value)

  if (isFiltered) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    itineraries = useMemo(() => {
      let filteredItineraries = [...itineraries]
      if (maxDuration) {
        filteredItineraries = filteredItineraries.filter(itinerary =>
          itinerary.legs.every(leg => leg.durationInMinutes <= maxDuration * 60)
        )
      }
      if (maxPrice) {
        filteredItineraries = filteredItineraries.filter(
          itinerary => itinerary.price.raw <= maxPrice
        )
      }
      if (airlines) {
        const airlinesArr = airlines
          .split(',')
          .map(x => x.trim().toLowerCase())
          .filter(x => x)
        filteredItineraries = filteredItineraries.filter(itinerary =>
          itinerary.legs.some(leg =>
            leg.segments.some(segment => {
              const carrier = segment.marketingCarrier
              if (!carrier) return false
              const carrierName = carrier.name ? carrier.name.toLowerCase() : ''
              const carrierAlt = carrier.alternateId
                ? carrier.alternateId.toString().toLowerCase()
                : ''
              return airlinesArr.some(
                input =>
                  carrierName.includes(input) || carrierAlt.includes(input)
              )
            })
          )
        )
      }
      if (sortBy) {
        if (sortBy === 'price_high') {
          filteredItineraries = filteredItineraries.sort(
            (a, b) => a.price.raw - b.price.raw
          )
        } else if (sortBy === 'fastest') {
          filteredItineraries = filteredItineraries.sort((a, b) => {
            const durationA = a.legs.reduce(
              (sum, leg) => sum + leg.durationInMinutes,
              0
            )
            const durationB = b.legs.reduce(
              (sum, leg) => sum + leg.durationInMinutes,
              0
            )
            return durationA - durationB
          })
        } else if (sortBy === 'outbound_take_off_time') {
          filteredItineraries = filteredItineraries.sort((a, b) => {
            const depA = new Date(a.legs[0].departure).getTime()
            const depB = new Date(b.legs[0].departure).getTime()
            return depA - depB
          })
        } else if (sortBy === 'outbound_landing_time') {
          filteredItineraries = filteredItineraries.sort((a, b) => {
            const arrA = new Date(a.legs[0].arrival).getTime()
            const arrB = new Date(b.legs[0].arrival).getTime()
            return arrA - arrB
          })
        } else if (
          sortBy === 'return_take_off_time' &&
          filteredItineraries[0]?.legs?.length > 1
        ) {
          filteredItineraries = filteredItineraries.sort((a, b) => {
            const depA = new Date(a.legs[1].departure).getTime()
            const depB = new Date(b.legs[1].departure).getTime()
            return depA - depB
          })
        } else if (
          sortBy === 'return_landing_time' &&
          filteredItineraries[0]?.legs?.length > 1
        ) {
          filteredItineraries = filteredItineraries.sort((a, b) => {
            const arrA = new Date(a.legs[1].arrival).getTime()
            const arrB = new Date(b.legs[1].arrival).getTime()
            return arrA - arrB
          })
        }
      }
      if (limit && limit > 0) {
        filteredItineraries = filteredItineraries.slice(0, limit)
      }
      return filteredItineraries
    }, [itineraries])
  }

  if (itineraries.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No flights to display. Please search for flights.
      </Typography>
    )
  }

  const paginatedItineraries = itineraries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Group paginated itineraries by origin
  const flightsByOrigin = paginatedItineraries.reduce((groups, itinerary) => {
    const firstLeg = itinerary.legs && itinerary.legs[0]
    const originName =
      (firstLeg &&
        firstLeg.origin &&
        firstLeg.origin.name &&
        firstLeg.origin.name.trim()) ||
      'Other Airports'
    if (!groups[originName]) {
      groups[originName] = []
    }
    groups[originName].push(itinerary)
    return groups
  }, {})

  return (
    <div>
      {Object.entries(flightsByOrigin).map(([origin, originFlights]) => (
        <div key={origin}>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Flights from {origin}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {originFlights.map((itinerary, index) => (
              <Grid item xs={12} key={index}>
                <FlightCard
                  flight={itinerary}
                  onClick={onSelectFlight}
                  searchParams={{
                    cabinClass,
                    adults,
                    childrens,
                    infants,
                    returnDate,
                  }}
                  selected={
                    selectedFlight && selectedFlight.id === itinerary.id
                  }
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </div>
  )
}

export default FlightSearch
