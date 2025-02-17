export const parseItineraries = flights => {
  let itineraries = []
  if (flights) {
    if (Array.isArray(flights)) {
      itineraries = flights
    } else if (flights.itineraries && Array.isArray(flights.itineraries)) {
      itineraries = flights.itineraries
    } else if (flights.data) {
      if (Array.isArray(flights.data)) {
        itineraries = flights.data
      } else if (
        flights.data.itineraries &&
        Array.isArray(flights.data.itineraries)
      ) {
        itineraries = flights.data.itineraries
      } else if (flights.data.id) {
        itineraries = [flights.data]
      }
    } else if (flights.id) {
      itineraries = [flights]
    }
  }
  return itineraries
}
