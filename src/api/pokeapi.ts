import type { PokemonSummary } from '../types/pokemon.ts'

const POKE_API_BASE = 'https://pokeapi.co/api/v2'

type PokeApiPokemonResponse = {
  id: number
  name: string
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default?: string | null
      }
    }
  }
  types: Array<{
    slot: number
    type: {
      name: string
    }
  }>
}

export class PokeApiError extends Error {
  code: 'not-found' | 'network' | 'unknown'

  constructor(message: string, code: 'not-found' | 'network' | 'unknown') {
    super(message)
    this.name = 'PokeApiError'
    this.code = code
  }
}

const isValidPokemonResponse = (value: unknown): value is PokeApiPokemonResponse => {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Record<string, unknown>

  if (typeof data.id !== 'number') return false
  if (typeof data.name !== 'string') return false
  if (typeof data.sprites !== 'object' || data.sprites === null) return false
  if (!Array.isArray(data.types)) return false

  return data.types.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false
    const typeEntry = entry as Record<string, unknown>
    if (typeof typeEntry.slot !== 'number') return false
    if (typeof typeEntry.type !== 'object' || typeEntry.type === null) return false
    const type = typeEntry.type as Record<string, unknown>
    return typeof type.name === 'string'
  })
}

export const fetchPokemon = async (idOrName: string): Promise<PokemonSummary> => {
  const normalized = idOrName.trim().toLowerCase().replace(/\s+/g, '-')

  if (!normalized) {
    throw new PokeApiError('El nombre o número no puede estar vacío', 'not-found')
  }

  const url = `${POKE_API_BASE}/pokemon/${encodeURIComponent(normalized)}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        throw new PokeApiError(`No se encontró el Pokémon "${idOrName}"`, 'not-found')
      }
      throw new PokeApiError(`Error de la API (${response.status})`, 'unknown')
    }

    const raw = await response.json()

    if (!isValidPokemonResponse(raw)) {
      throw new PokeApiError('La respuesta de PokeAPI no tiene el formato esperado', 'unknown')
    }

    const spriteUrl =
      raw.sprites.other?.['official-artwork']?.front_default ??
      raw.sprites.front_default ??
      ''

    return {
      id: raw.id,
      name: raw.name,
      spriteUrl,
      types: raw.types
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map((type) => type.type.name),
    }
  } catch (error) {
    if (error instanceof PokeApiError) {
      throw error
    }
    if (error instanceof TypeError) {
      throw new PokeApiError('No se pudo conectar con PokeAPI', 'network')
    }
    throw new PokeApiError('Error inesperado al buscar el Pokémon', 'unknown')
  }
}
