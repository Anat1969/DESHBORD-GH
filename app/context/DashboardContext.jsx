import { createContext, useContext, useReducer, useCallback } from 'react'

const DashboardContext = createContext(null)

const initialState = {
  data: null,
  filters: {
    neighborhood: 'all',
    category: 'all'
  },
  filteredData: null,
  loading: true
}

function applyFilters(data, filters) {
  if (!data) return null

  let neighborhoods = data.neighborhoods
  let categories = data.categories

  if (filters.neighborhood !== 'all') {
    neighborhoods = neighborhoods.filter(n => n.id === filters.neighborhood)
  }

  if (filters.category !== 'all') {
    neighborhoods = neighborhoods.map(n => ({
      ...n,
      categories: n.categories.filter(c => c.id === filters.category),
      businesses: filters.category !== 'all'
        ? n.categories.find(c => c.id === filters.category)?.count || 0
        : n.businesses,
      income: filters.category !== 'all'
        ? n.categories.find(c => c.id === filters.category)?.income || 0
        : n.income
    }))
    categories = categories.filter(c => c.id === filters.category)
  }

  const totalBusinesses = neighborhoods.reduce((sum, n) => sum + n.businesses, 0)
  const totalIncome = neighborhoods.reduce((sum, n) => sum + n.income, 0)
  const avgVacancy = neighborhoods.length > 0
    ? neighborhoods.reduce((sum, n) => sum + n.vacancy, 0) / neighborhoods.length
    : 0

  return {
    ...data,
    neighborhoods,
    categories,
    summary: {
      ...data.summary,
      total_businesses: totalBusinesses,
      total_income: totalIncome,
      avg_vacancy: avgVacancy,
      neighborhoods_count: neighborhoods.length
    }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA': {
      const data = action.payload
      return {
        ...state,
        data,
        filteredData: applyFilters(data, state.filters),
        loading: false
      }
    }
    case 'SET_FILTER': {
      const filters = { ...state.filters, [action.key]: action.value }
      return {
        ...state,
        filters,
        filteredData: applyFilters(state.data, filters)
      }
    }
    case 'RESET_FILTERS': {
      const filters = { neighborhood: 'all', category: 'all' }
      return {
        ...state,
        filters,
        filteredData: applyFilters(state.data, filters)
      }
    }
    default:
      return state
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setData = useCallback((data) => {
    dispatch({ type: 'SET_DATA', payload: data })
  }, [])

  const setFilter = useCallback((key, value) => {
    dispatch({ type: 'SET_FILTER', key, value })
  }, [])

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' })
  }, [])

  return (
    <DashboardContext.Provider value={{ ...state, setData, setFilter, resetFilters }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used within DashboardProvider')
  return context
}
