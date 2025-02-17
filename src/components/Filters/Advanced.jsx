import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Grid,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'
import useFilters from 'store/useFilters'

import PassengerCount from './PassengerCount'

const AdvancedFilters = () => {
  const {
    returnDate,
    cabinClass,
    sortBy,
    limit,
    currency,
    maxDuration,
    maxPrice,
    airlines,
    setField,
  } = useFilters()

  return (
    <Accordion sx={{ my: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Advanced Options</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Return Date"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={returnDate}
              onChange={e => setField('returnDate', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Cabin Class"
              variant="outlined"
              fullWidth
              value={cabinClass}
              onChange={e => setField('cabinClass', e.target.value)}
            >
              <MenuItem value="economy">Economy</MenuItem>
              <MenuItem value="premium_economy">Premium Economy</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="first">First</MenuItem>
            </TextField>
          </Grid>
          <PassengerCount />
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Sort By"
              variant="outlined"
              fullWidth
              value={sortBy}
              onChange={e => setField('sortBy', e.target.value)}
            >
              <MenuItem value="best">Best</MenuItem>
              <MenuItem value="price_high">Cheapest</MenuItem>
              <MenuItem value="fastest">Fastest</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Limit"
              type="number"
              variant="outlined"
              fullWidth
              value={limit}
              onChange={e => setField('limit', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Currency"
              variant="outlined"
              fullWidth
              value={currency}
              onChange={e => setField('currency', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Max Duration (hrs)"
              type="number"
              variant="outlined"
              fullWidth
              inputProps={{ min: 0 }}
              value={maxDuration}
              onChange={e => setField('maxDuration', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Max Price"
              type="number"
              variant="outlined"
              fullWidth
              inputProps={{ min: 0 }}
              value={maxPrice}
              onChange={e => setField('maxPrice', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Airlines (comma-separated)"
              variant="outlined"
              fullWidth
              helperText="Enter airline codes or names"
              value={airlines}
              onChange={e => setField('airlines', e.target.value)}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default AdvancedFilters
