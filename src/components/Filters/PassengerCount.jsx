import { Grid, TextField } from '@mui/material'
import useFilters from 'store/useFilters'

const PassengerCount = () => {
  const { adults, childrens, infants, setField } = useFilters()

  return (
    <>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Adults"
          type="number"
          variant="outlined"
          fullWidth
          inputProps={{ min: 1 }}
          value={adults}
          onChange={e => setField('adults', parseInt(e.target.value, 10))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Children"
          type="number"
          variant="outlined"
          fullWidth
          inputProps={{ min: 0 }}
          value={childrens}
          onChange={e => setField('childrens', parseInt(e.target.value, 10))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Infants"
          type="number"
          variant="outlined"
          fullWidth
          inputProps={{ min: 0 }}
          value={infants}
          onChange={e => setField('infants', parseInt(e.target.value, 10))}
        />
      </Grid>
    </>
  )
}

export default PassengerCount
