import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Grid,
  Box,
  Divider,
  IconButton,
  Collapse,
  Stack,
} from '@mui/material'
import React, { useState } from 'react'

const FlightCard = ({ flight, searchParams, onClick, selected }) => {
  // Destructure flight details (omit id and score)
  const { price, legs, farePolicy } = flight
  const [expanded, setExpanded] = useState(false)

  const formatDateTime = dt =>
    new Date(dt).toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  const handleExpandClick = e => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  // Build a summary route from the first leg
  let summaryText = ''
  if (legs && legs.length > 0) {
    const firstLeg = legs[0]
    summaryText = `${firstLeg.origin.name} (${firstLeg.origin.displayCode}) → ${firstLeg.destination.name} (${firstLeg.destination.displayCode})`
  }

  return (
    <Card
      onClick={() => onClick(flight)}
      sx={{
        mb: 3,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        cursor: 'pointer',
        border: selected ? '2px solid red' : 'none',
        backgroundColor: selected ? '#fff0f0' : 'inherit',
      }}
    >
      <CardHeader
        avatar={
          legs && legs[0] && legs[0].carriers?.marketing?.[0] ? (
            <Avatar
              src={legs[0].carriers.marketing[0].logoUrl}
              alt={legs[0].carriers.marketing[0].name}
              sx={{ width: 56, height: 56 }}
            />
          ) : (
            <Avatar sx={{ width: 56, height: 56 }}>
              {price.formatted.charAt(0)}
            </Avatar>
          )
        }
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            {/* Total Price: {price.formatted} */}
            {summaryText}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            {/* {summaryText} */}
            Total Price: {price.formatted}
          </Typography>
        }
        action={
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {farePolicy && (
            <Box
              sx={{ mb: 2, backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}
            >
              <Typography variant="subtitle2">Fare Policy:</Typography>
              <Typography variant="body2" color="textSecondary">
                Change Allowed: {farePolicy.isChangeAllowed ? 'Yes' : 'No'} |
                Partially Changeable:{' '}
                {farePolicy.isPartiallyChangeable ? 'Yes' : 'No'} | Cancellation
                Allowed: {farePolicy.isCancellationAllowed ? 'Yes' : 'No'} |
                Partially Refundable:{' '}
                {farePolicy.isPartiallyRefundable ? 'Yes' : 'No'}
              </Typography>
            </Box>
          )}
          {/* Detailed leg and segment information */}
          {legs &&
            legs.map((leg, legIndex) => {
              const departureTime = formatDateTime(leg.departure)
              const arrivalTime = formatDateTime(leg.arrival)
              const durationHours = Math.floor(leg.durationInMinutes / 60)
              const durationMinutes = leg.durationInMinutes % 60
              return (
                <Box
                  key={leg.id}
                  sx={{
                    mb: 3,
                    border: '1px solid #e0e0e0',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: 'primary.main' }}
                  >
                    {legIndex === 0 ? 'Outbound Flight' : 'Return Flight'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon color="action" />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Origin:
                          </Typography>
                          <Typography variant="body1">
                            {leg.origin.name} ({leg.origin.displayCode})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {leg.origin.city}, {leg.origin.country}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon color="action" />
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            Destination:
                          </Typography>
                          <Typography variant="body1">
                            {leg.destination.name} (
                            {leg.destination.displayCode})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {leg.destination.city}, {leg.destination.country}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FlightTakeoffIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Departure:</strong> {departureTime}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FlightLandIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Arrival:</strong> {arrivalTime}{' '}
                        {leg.timeDeltaInDays > 0 &&
                          ` (+${leg.timeDeltaInDays} day)`}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Duration:</strong> {durationHours}h{' '}
                        {durationMinutes}m
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Stops:</strong> {leg.stopCount}
                    </Typography>
                  </Box>
                  {leg.segments &&
                    leg.segments.map((segment, segIndex) => {
                      const segDeparture = formatDateTime(segment.departure)
                      const segArrival = formatDateTime(segment.arrival)
                      const segDurationHours = Math.floor(
                        segment.durationInMinutes / 60
                      )
                      const segDurationMinutes = segment.durationInMinutes % 60
                      const carrier = segment.marketingCarrier
                      return (
                        <Box
                          key={segment.id}
                          sx={{
                            mt: 2,
                            ml: 2,
                            borderLeft: '3px solid #1976d2',
                            pl: 2,
                            backgroundColor: '#e3f2fd',
                            borderRadius: 1,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {carrier && (
                              <Avatar
                                src={carrier.logoUrl}
                                alt={carrier.name}
                                sx={{ width: 32, height: 32 }}
                              />
                            )}
                            <Typography variant="subtitle2">
                              Segment {segIndex + 1} (Flight{' '}
                              {segment.flightNumber})
                            </Typography>
                          </Stack>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {segment.origin.name} ({segment.origin.displayCode})
                            → {segment.destination.name} (
                            {segment.destination.displayCode})
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mt: 1 }}
                          >
                            <FlightTakeoffIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography variant="body2">
                              <strong>Dep:</strong> {segDeparture}
                            </Typography>
                            <FlightLandIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Arr:</strong> {segArrival}
                            </Typography>
                          </Stack>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {segDurationHours}h{' '}
                            {segDurationMinutes}m
                          </Typography>
                          {carrier && (
                            <Typography variant="body2">
                              <strong>Carrier:</strong> {carrier.name}
                            </Typography>
                          )}
                        </Box>
                      )
                    })}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              )
            })}
        </CardContent>
      </Collapse>
      {/* Always visible extra info */}
      {searchParams && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed #aaa',
            borderRadius: 2,
            backgroundColor: '#fffde7',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            <strong>Cabin Class:</strong>{' '}
            {searchParams.cabinClass.charAt(0).toUpperCase() +
              searchParams.cabinClass.slice(1)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Passengers:</strong> {searchParams.adults} Adult(s),{' '}
            {searchParams.childrens} Child(ren), {searchParams.infants}{' '}
            Infant(s)
          </Typography>
          {searchParams.returnDate && (
            <Typography variant="body2" color="textSecondary">
              <strong>Return Date:</strong> {searchParams.returnDate}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  )
}

export default FlightCard
