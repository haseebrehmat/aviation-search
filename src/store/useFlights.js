import { create } from 'zustand'

const useFlights = create(set => ({
  flights: null,
  selectedFlight: null,
  airports: {
    origin: null,
    destination: null,
  },

  setFlights: value => set({ flights: value }),
  setSelectedFlight: value => set({ selectedFlight: value }),
  setAirports: (field, value) =>
    set(state => ({ airports: { ...state.airports, [field]: value } })),
}))

export default useFlights
