import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import { Container, Box } from '@mui/material'
import React, { useState } from 'react'
import useFlights from 'store/useFlights'

import FlightMap from './components/FlightMap'
import FlightSearch from './components/FlightSearch'
import SearchForm from './components/SearchForm'

function App() {
  const [selectedFlight, setSelectedFlight] = useState(null)
  const { flights } = useFlights()

  return (
    <Container sx={{ my: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'primary.main',
        }}
      >
        <LocalAirportIcon
          sx={{ fontSize: 100, color: 'primary.main', mb: 4 }}
        />
        <h1>Aviation Search</h1>
      </Box>
      <SearchForm />
      {flights ? (
        <>
          {selectedFlight && (
            <Box sx={{ mt: 4 }}>
              <FlightMap flight={selectedFlight} />
            </Box>
          )}
          <Box sx={{ mt: 4 }}>
            <FlightSearch
              onSelectFlight={setSelectedFlight}
              selectedFlight={selectedFlight}
            />
          </Box>
        </>
      ) : null}
    </Container>
  )
}

export default App
