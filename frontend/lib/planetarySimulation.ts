import {
  calculateBaseTemperature,
  calculateGreenhouseMultiplier,
  canRetainAtmosphere,
  determineBiome,
  calculateESI,
} from './planetaryPhysics'

/**
 * Runs a simulation step for a planet.
 * Returns updated state including temperature (C), biome, and ESI.
 */
export interface SimulationInput {
  distance: number // AU
  mass: number // Earth masses
  co2: number // %
  water: number // %
  coreStatus: 'Active' | 'Inactive'
}

export interface SimulationResult {
  temperatureK: number
  temperatureC: number
  atmosphereRetained: boolean
  biome: string
  esi: number
}

export function runSimulationStep(input: SimulationInput): SimulationResult {
  const baseTempK = calculateBaseTemperature(input.distance)
  const greenhouseMultiplier = calculateGreenhouseMultiplier(input.co2)
  const temperatureK = baseTempK * greenhouseMultiplier
  const temperatureC = temperatureK - 273.15
  const atmosphereRetained = canRetainAtmosphere(input.mass, temperatureK)
  const biome = determineBiome(temperatureC, input.water, input.co2, input.coreStatus)
  // For ESI we need radius, density, escape velocity – placeholder using mass as radius proxy
  const radius = Math.cbrt(input.mass) // crude approximation
  const density = 5.5 // assume Earth‑like density as placeholder
  const escapeVelocity = Math.sqrt(input.mass) * 11.186 // scaling from Earth
  const esi = calculateESI(radius, density, escapeVelocity, temperatureK)
  return { temperatureK, temperatureC, atmosphereRetained, biome, esi }
}
