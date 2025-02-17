import axios from 'axios'

const API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com'
const RAPIDAPI_KEY = 'cf11dcc274msh1f3e9e83625eb87p1819bdjsn12c2cc334267' // Your key
const RAPIDAPI_HOST = 'sky-scrapper.p.rapidapi.com'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
})

export const getLocale = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/getLocale')
    return response.data
  } catch (error) {
    console.error('Error fetching locale:', error)
    throw error
  }
}

export const searchAirport = async (query, locale = 'en-US') => {
  try {
    const response = await axiosInstance.get('/api/v1/flights/searchAirport', {
      params: { query, locale },
    })
    return response.data
  } catch (error) {
    console.error('Error searching airport:', error)
    throw error
  }
}

export const getNearByAirports = async (lat, lng, locale = 'en-US') => {
  try {
    const response = await axiosInstance.get(
      '/api/v1/flights/getNearByAirports',
      {
        params: { lat, lng, locale },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error getting nearby airports:', error)
    throw error
  }
}

export const searchFlightsComplete = async (
  origin,
  destination,
  additionalParams = {}
) => {
  try {
    const params = {
      originSkyId: origin.skyId,
      destinationSkyId: destination.skyId,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date: additionalParams.date,
      returnDate: additionalParams.returnDate,
      cabinClass: additionalParams.cabinClass || 'economy',
      adults: additionalParams.adults || 1,
      childrens: additionalParams.childrens || 0,
      infants: additionalParams.infants || 0,
      sortBy: additionalParams.sortBy || 'best',
      limit: additionalParams.limit,
      carriersIds: additionalParams.carriersIds,
      currency: additionalParams.currency || 'USD',
      // The following new filters are sent to the API (if needed)
      maxStops: additionalParams.maxStops,
      maxDuration: additionalParams.maxDuration,
      maxPrice: additionalParams.maxPrice,
      airlines: additionalParams.airlines,
    }

    const response = await axiosInstance.get(
      '/api/v2/flights/searchFlightsComplete',
      { params }
    )
    const data =
      typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data
    console.log('Parsed API response:', data)
    return data
  } catch (error) {
    console.error('Error searching flights:', error)
    throw error
  }
}

export const getFlightDetails = async (
  legs,
  adults = 1,
  cabinClass = 'economy',
  currency = 'USD',
  locale = 'en-US'
) => {
  try {
    const params = {
      legs: JSON.stringify(legs),
      adults,
      cabinClass,
      currency,
      locale,
    }
    const response = await axiosInstance.get(
      '/api/v1/flights/getFlightDetails',
      { params }
    )
    return response.data
  } catch (error) {
    console.error('Error getting flight details:', error)
    throw error
  }
}
