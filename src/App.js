// App.js
import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import SearchForm from './components/SearchForm';
import FlightSearch from './components/FlightSearch';
import FlightMap from './components/FlightMap';

function App() {
  const [results, setResults] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleResults = (data) => {
    console.log("Search results:", data);
    setResults(data);
    setSelectedFlight(null); // reset selected flight on new search
  };

  return (
    <Container sx={{ my: 4 }}>
      <SearchForm onResults={handleResults} />
      {results && results.flights && (
        <>
          {selectedFlight && (
            <Box sx={{ mt: 4 }}>
              <FlightMap flight={selectedFlight} />
            </Box>
          )}
          <Box sx={{ mt: 4 }}>
            <FlightSearch
              flights={results.flights}
              searchParams={results.searchParams}
              onSelectFlight={setSelectedFlight}
              selectedFlight={selectedFlight}
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;