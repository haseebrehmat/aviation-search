import { create } from 'zustand'

import { FILTERS_DEFAULTS } from '../lib/constants'

const useFilters = create(set => ({
  ...FILTERS_DEFAULTS,

  setField: (field, value) => set({ [field]: value }),
  reset: () => set(FILTERS_DEFAULTS),
}))

export default useFilters
