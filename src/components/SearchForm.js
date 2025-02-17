import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { getNearByAirports, searchAirport, searchFlightsComplete } from '../api/api';

const SearchForm = ({ onResults }) => {
  // Basic fields
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [date, setDate] = useState('');
  
  // Advanced options
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [adults, setAdults] = useState(1);
  const [childrens, setChildrens] = useState(0);
  const [infants, setInfants] = useState(0);
  const [sortBy, setSortBy] = useState('best');
  const [limit, setLimit] = useState('');
  // Removed carriersIds state
  const [currency, setCurrency] = useState('USD');
  
  // New filter fields (maxStops removed)
  const [maxDuration, setMaxDuration] = useState(''); // in hours
  const [maxPrice, setMaxPrice] = useState('');
  const [airlines, setAirlines] = useState(''); // comma-separated airline codes or names

  const [loading, setLoading] = useState(false);

  // Use browser Geolocation to get user's coordinates and then find nearby airports.
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const nearbyResponse = await getNearByAirports(latitude, longitude);
            if (
              nearbyResponse.data &&
              nearbyResponse.data.nearby &&
              nearbyResponse.data.nearby.length > 0
            ) {
              const airport = nearbyResponse.data.nearby[0];
              setOriginQuery(airport.presentation.title);
            } else {
              alert('No nearby airports found.');
            }
          } catch (error) {
            console.error(error);
            alert('Error retrieving nearby airports.');
          }
        },
        (error) => {
          console.error(error);
          alert('Error retrieving your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originQuery || !destinationQuery || !date) {
      alert('Please fill in the origin, destination and departure date fields');
      return;
    }
    setLoading(true);
    try {
      const originResponse = await searchAirport(originQuery);
      if (!originResponse.data || originResponse.data.length === 0) {
        alert('No airport found for origin');
        setLoading(false);
        return;
      }
      const originAirport = originResponse.data[0];

      const destinationResponse = await searchAirport(destinationQuery);
      if (!destinationResponse.data || destinationResponse.data.length === 0) {
        alert('No airport found for destination');
        setLoading(false);
        return;
      }
      const destinationAirport = destinationResponse.data[0];

      const advancedParams = {
        returnDate: returnDate || undefined,
        cabinClass,
        adults,
        childrens,
        infants,
        sortBy,
        limit: limit ? parseInt(limit, 10) : undefined,
        // Removed carriersIds
        currency,
        // New filters
        maxDuration: maxDuration ? parseFloat(maxDuration) : undefined, // in hours
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        airlines: airlines || undefined
      };

      const flightsResponse = await searchFlightsComplete(originAirport, destinationAirport, { date, ...advancedParams });
      if (flightsResponse && flightsResponse.data) {
        onResults({ flights: flightsResponse, searchParams: advancedParams });
      } else {
        alert('No flights found');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred while searching for flights');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Basic Fields */}
        <Grid item xs={12} sm={5}>
          <TextField
            id="origin"
            name="origin"
            label="Origin"
            variant="outlined"
            fullWidth
            value={originQuery}
            onChange={(e) => setOriginQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <IconButton color="primary" onClick={handleUseCurrentLocation} aria-label="Use current location">
            <MyLocationIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="destination"
            name="destination"
            label="Destination"
            variant="outlined"
            fullWidth
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="departure-date"
            name="departure-date"
            label="Departure Date"
            type="date"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Grid>

        {/* Advanced Options Accordion */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Advanced Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Existing advanced options */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="return-date"
                    name="return-date"
                    label="Return Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="cabin-class"
                    name="cabin-class"
                    select
                    label="Cabin Class"
                    variant="outlined"
                    fullWidth
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                  >
                    <MenuItem value="economy">Economy</MenuItem>
                    <MenuItem value="premium_economy">Premium Economy</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="first">First</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="adults"
                    name="adults"
                    label="Adults"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: 1 }}
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value, 10))}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="children"
                    name="children"
                    label="Children"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: 0 }}
                    value={childrens}
                    onChange={(e) => setChildrens(parseInt(e.target.value, 10))}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="infants"
                    name="infants"
                    label="Infants"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: 0 }}
                    value={infants}
                    onChange={(e) => setInfants(parseInt(e.target.value, 10))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="sort-by"
                    name="sort-by"
                    select
                    label="Sort By"
                    variant="outlined"
                    fullWidth
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="best">Best</MenuItem>
                    <MenuItem value="price_high">Cheapest</MenuItem>
                    <MenuItem value="fastest">Fastest</MenuItem>
                    <MenuItem value="outbound_take_off_time">Outbound Take Off Time</MenuItem>
                    <MenuItem value="outbound_landing_time">Outbound Landing Time</MenuItem>
                    <MenuItem value="return_take_off_time">Return Take Off Time</MenuItem>
                    <MenuItem value="return_landing_time">Return Landing Time</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="limit"
                    name="limit"
                    label="Limit"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="currency"
                    name="currency"
                    label="Currency"
                    variant="outlined"
                    fullWidth
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </Grid>
                {/* New filter fields (maxStops removed) */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="max-duration"
                    name="max-duration"
                    label="Max Duration (hrs)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: 0 }}
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="max-price"
                    name="max-price"
                    label="Max Price"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: 0 }}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="airlines"
                    name="airlines"
                    label="Airlines (comma-separated)"
                    variant="outlined"
                    fullWidth
                    helperText="Enter airline codes or names"
                    value={airlines}
                    onChange={(e) => setAirlines(e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Search Flights'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchForm;