import { Box, Button, CircularProgress } from '@mui/material'
import { searchFlightsComplete } from 'api/api'
import React, { useState } from 'react'
import useFilters from 'store/useFilters'
import useFlights from 'store/useFlights'

import Advanced from './Filters/Advanced'
import Basic from './Filters/Basic'

const SearchForm = () => {
  const [loading, setLoading] = useState(false)

  const filters = useFilters()
  const { setFlights, airports } = useFlights()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (airports?.origin && airports?.destination) {
        const flightsResponse = await searchFlightsComplete(
          airports?.origin,
          airports?.destination,
          filters
        )
        setFlights(flightsResponse)
      } else {
        alert('No flights found')
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Basic />
      <Advanced />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || !airports.origin || !airports.destination}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Search Flights'}
      </Button>
    </Box>
  )
}

export default SearchForm
