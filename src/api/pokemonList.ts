import type { PokemonListItem } from '../types/pokemon.ts'

const POKE_API_BASE = 'https://pokeapi.co/api/v2'
const BASE_FORMS_LIMIT = 1025

type PokeApiListResponse = {
  results: Array<{
    name: string
    url: string
  }>
}

const extractIdFromUrl = (url: string): number => {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

const isValidListResponse = (value: unknown): value is PokeApiListResponse => {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Record<string, unknown>
  if (!Array.isArray(data.results)) return false

  return data.results.every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false
    const item = entry as Record<string, unknown>
    return typeof item.name === 'string' && typeof item.url === 'string'
  })
}

let cache: PokemonListItem[] | null = null

export const fetchAllPokemon = async (): Promise<PokemonListItem[]> => {
  if (cache) return cache

  const response = await fetch(`${POKE_API_BASE}/pokemon?limit=${BASE_FORMS_LIMIT}`)

  if (!response.ok) {
    throw new Error(`Error al cargar la lista de Pokémon (${response.status})`)
  }

  const raw = await response.json()

  if (!isValidListResponse(raw)) {
    throw new Error('La respuesta de la lista de Pokémon no tiene el formato esperado')
  }

  const list = raw.results.map((item) => ({
    name: item.name,
    id: extractIdFromUrl(item.url),
  }))

  cache = list
  return list
}
