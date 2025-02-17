import MyLocationIcon from '@mui/icons-material/MyLocation'
import { TextField, Grid, IconButton } from '@mui/material'
import { searchAirport } from 'api/api'
import useFilters from 'store/useFilters'
import useFlights from 'store/useFlights'

const Basic = () => {
  const { originQuery, destinationQuery, date, setField } = useFilters()
  const { setAirports } = useFlights()

  const handleAirports = async type => {
    if (!originQuery && !destinationQuery) return

    if (type === 'origin') {
      const originResponse = await searchAirport(originQuery)
      setAirports('origin', originResponse.data[0])
    } else if (type === 'destination') {
      const destinationResponse = await searchAirport(destinationQuery)
      setAirports('destination', destinationResponse.data[0])
    }
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={4}>
        <TextField
          label="Origin"
          fullWidth
          value={originQuery}
          onChange={e => setField('originQuery', e.target.value)}
          onBlur={() => handleAirports('origin')}
        />
      </Grid>
      <Grid item xs={12} sm={1}>
        <IconButton color="primary" aria-label="Use current location">
          <MyLocationIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Destination"
          fullWidth
          value={destinationQuery}
          onChange={e => setField('destinationQuery', e.target.value)}
          onBlur={() => handleAirports('destination')}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Departure Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={e => setField('date', e.target.value)}
        />
      </Grid>
    </Grid>
  )
}

export default Basic
