import { useState, useCallback } from 'react'
import { runSimulationStep, SimulationInput, SimulationResult } from './planetarySimulation'
import { generateEvolutionReport } from './planetaryAIAnalyst'

export interface PlanetaryState extends SimulationInput {
  systemType: 'Solar System' | 'Exoplanet'
  target: string
  yearsPerStep: number
  currentYear: number
  simulation: SimulationResult
  eventLog: string[]
  initialState: PlanetaryState | null
}

// Preset data for targets
const solarSystemPresets: Record<string, SimulationInput> = {
  Earth: { distance: 1, mass: 1, co2: 0.04, water: 71, coreStatus: 'Active' },
  Mars: { distance: 1.52, mass: 0.107, co2: 0.95, water: 0.03, coreStatus: 'Inactive' },
  Venus: { distance: 0.72, mass: 0.815, co2: 96.5, water: 0, coreStatus: 'Active' },
}

const exoplanetPresets: Record<string, SimulationInput> = {
  "Super-Earth": { distance: 0.9, mass: 5, co2: 0.1, water: 30, coreStatus: 'Active' },
  "Hot Jupiter": { distance: 0.05, mass: 300, co2: 10, water: 0, coreStatus: 'Active' },
  "Mini-Neptune": { distance: 0.3, mass: 10, co2: 5, water: 20, coreStatus: 'Inactive' },
}

export function usePlanetarySimulation() {
  const [state, setState] = useState<PlanetaryState>(() => {
    const initialPreset = solarSystemPresets['Earth']
    const sim = runSimulationStep({ ...initialPreset, coreStatus: 'Active' })
    const init: PlanetaryState = {
      systemType: 'Solar System',
      target: 'Earth',
      yearsPerStep: 100000,
      currentYear: 0,
      ...initialPreset,
      simulation: sim,
      eventLog: [],
      initialState: null,
    }
    init.initialState = { ...init }
    return init
  })

  const addEvent = useCallback((msg: string) => {
    setState(prev => ({ ...prev, eventLog: [...prev.eventLog, msg] }))
  }, [])

  const updateTarget = useCallback((system: PlanetaryState['systemType'], target: string) => {
    const preset = system === 'Solar System' ? solarSystemPresets[target] : exoplanetPresets[target]
    if (!preset) return
    const sim = runSimulationStep(preset)
    setState(prev => ({
      ...prev,
      systemType: system,
      target,
      ...preset,
      simulation: sim,
    }))
  }, [])

  const advanceTime = useCallback(() => {
    const newYear = state.currentYear + state.yearsPerStep
    const sim = runSimulationStep({
      distance: state.distance,
      mass: state.mass,
      co2: state.co2,
      water: state.water,
      coreStatus: state.coreStatus,
    })
    // Detect simple threshold events
    if (sim.temperatureC > 100 && state.simulation.temperatureC <= 100) {
      addEvent('Surface temperature exceeded 100°C – potential runaway greenhouse')
    }
    if (!sim.atmosphereRetained && state.simulation.atmosphereRetained) {
      addEvent('Atmosphere lost due to insufficient mass/heat')
    }
    setState(prev => ({
      ...prev,
      currentYear: newYear,
      simulation: sim,
    }))
  }, [state, addEvent])

  const generateReport = useCallback(() => {
    if (!state.initialState) return ''
    const timeElapsed = state.currentYear - state.initialState.currentYear
    const report = generateEvolutionReport(state.initialState, {
      ...state,
      temperature: state.simulation.temperatureC,
      biome: state.simulation.biome,
    }, timeElapsed)
    return report
  }, [state])

  return { state, setState, updateTarget, advanceTime, generateReport, addEvent }
}
