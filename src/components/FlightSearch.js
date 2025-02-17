// FlightSearch.js
import React, { useState } from 'react';
import { Grid, Typography, Divider, Pagination, Box } from '@mui/material';
import FlightCard from './FlightCard';

const FlightSearch = ({ flights, searchParams, onSelectFlight, selectedFlight }) => {
  let itineraries = [];

  if (flights) {
    if (Array.isArray(flights)) {
      itineraries = flights;
    } else if (flights.itineraries && Array.isArray(flights.itineraries)) {
      itineraries = flights.itineraries;
    } else if (flights.data) {
      if (Array.isArray(flights.data)) {
        itineraries = flights.data;
      } else if (flights.data.itineraries && Array.isArray(flights.data.itineraries)) {
        itineraries = flights.data.itineraries;
      } else if (flights.data.id) {
        itineraries = [flights.data];
      }
    } else if (flights.id) {
      itineraries = [flights];
    }
  }

  console.log("Itineraries count before filtering:", itineraries.length);

  if (searchParams) {
    // Filter by max duration (each leg's duration in minutes must be <= maxDuration*60)
    if (searchParams.maxDuration !== undefined) {
      itineraries = itineraries.filter(itinerary =>
        itinerary.legs.every(leg => leg.durationInMinutes <= searchParams.maxDuration * 60)
      );
    }
    // Filter by max price (price.raw must be <= maxPrice)
    if (searchParams.maxPrice !== undefined) {
      itineraries = itineraries.filter(itinerary => itinerary.price.raw <= searchParams.maxPrice);
    }
    // Filter by airlines
    if (searchParams.airlines) {
      const airlinesArr = searchParams.airlines
        .split(',')
        .map(x => x.trim().toLowerCase())
        .filter(x => x);
      itineraries = itineraries.filter(itinerary =>
        itinerary.legs.some(leg =>
          leg.segments.some(segment => {
            const carrier = segment.marketingCarrier;
            if (!carrier) return false;
            const carrierName = carrier.name ? carrier.name.toLowerCase() : "";
            const carrierAlt = carrier.alternateId ? carrier.alternateId.toString().toLowerCase() : "";
            return airlinesArr.some(input =>
              carrierName.includes(input) || carrierAlt.includes(input)
            );
          })
        )
      );
    }
    // Client-side sorting
    if (searchParams.sortBy) {
      if (searchParams.sortBy === 'price_high') {
        itineraries = itineraries.sort((a, b) => a.price.raw - b.price.raw);
      } else if (searchParams.sortBy === 'fastest') {
        itineraries = itineraries.sort((a, b) => {
          const durationA = a.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
          const durationB = b.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
          return durationA - durationB;
        });
      } else if (searchParams.sortBy === 'outbound_take_off_time') {
        itineraries = itineraries.sort((a, b) => {
          const depA = new Date(a.legs[0].departure).getTime();
          const depB = new Date(b.legs[0].departure).getTime();
          return depA - depB;
        });
      } else if (searchParams.sortBy === 'outbound_landing_time') {
        itineraries = itineraries.sort((a, b) => {
          const arrA = new Date(a.legs[0].arrival).getTime();
          const arrB = new Date(b.legs[0].arrival).getTime();
          return arrA - arrB;
        });
      } else if (searchParams.sortBy === 'return_take_off_time' && itineraries[0]?.legs?.length > 1) {
        itineraries = itineraries.sort((a, b) => {
          const depA = new Date(a.legs[1].departure).getTime();
          const depB = new Date(b.legs[1].departure).getTime();
          return depA - depB;
        });
      } else if (searchParams.sortBy === 'return_landing_time' && itineraries[0]?.legs?.length > 1) {
        itineraries = itineraries.sort((a, b) => {
          const arrA = new Date(a.legs[1].arrival).getTime();
          const arrB = new Date(b.legs[1].arrival).getTime();
          return arrA - arrB;
        });
      }
    }
    if (searchParams.limit && searchParams.limit > 0) {
      itineraries = itineraries.slice(0, searchParams.limit);
    }
  }

  console.log("Itineraries count after filtering:", itineraries.length);

  if (itineraries.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No flights to display. Please search for flights.
      </Typography>
    );
  }

  // --- Pagination Setup ---
  const itemsPerPage = 5; // Adjust as needed
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(itineraries.length / itemsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Slice itineraries for current page
  const paginatedItineraries = itineraries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Group paginated itineraries by origin
  const flightsByOrigin = paginatedItineraries.reduce((groups, itinerary) => {
    const firstLeg = itinerary.legs && itinerary.legs[0];
    const originName =
      (firstLeg && firstLeg.origin && firstLeg.origin.name && firstLeg.origin.name.trim()) ||
      'Other Airports';
    if (!groups[originName]) {
      groups[originName] = [];
    }
    groups[originName].push(itinerary);
    return groups;
  }, {});

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
                  searchParams={searchParams}
                  onClick={onSelectFlight}
                  selected={selectedFlight && selectedFlight.id === itinerary.id}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} />
      </Box>
    </div>
  );
};

export default FlightSearch;
