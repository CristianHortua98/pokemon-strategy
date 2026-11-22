import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'

import { useDebounce } from '../hooks/useDebounce.ts'
import { fetchAllPokemon } from '../api/pokemonList.ts'
import { fetchPokemon, PokeApiError } from '../api/pokeapi.ts'
import type { PokemonListItem, PokemonSummary, TeamKind, TeamSlot } from '../types/pokemon.ts'

type PokemonSlotProps = {
  kind: TeamKind
  index: number
  slot: TeamSlot
  setPokemon: (kind: TeamKind, index: number, pokemon: PokemonSummary) => boolean
  clearSlot: (kind: TeamKind, index: number) => void
}

const DEBOUNCE_MS = 5000
const MAX_SUGGESTIONS = 8

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-violet-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-neutral-700',
  steel: 'bg-slate-400',
  fairy: 'bg-rose-300',
}

export const PokemonSlot = ({
  kind,
  index,
  slot,
  setPokemon,
  clearSlot,
}: PokemonSlotProps) => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([])
  const [isListLoading, setIsListLoading] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const lastSearchedRef = useRef<string | null>(null)
  const isSearchingRef = useRef(false)

  useEffect(() => {
    fetchAllPokemon()
      .then(setAllPokemon)
      .catch(() => setError('No se pudo cargar la lista de Pokémon'))
      .finally(() => setIsListLoading(false))
  }, [])

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query])

  const suggestions = useMemo(() => {
    if (!normalizedQuery || isListLoading) return []
    return allPokemon
      .filter((pokemon) => pokemon.name.includes(normalizedQuery))
      .slice(0, MAX_SUGGESTIONS)
  }, [allPokemon, normalizedQuery, isListLoading])

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      const normalized = searchTerm.trim()
      if (!normalized || isSearchingRef.current) return

      isSearchingRef.current = true
      lastSearchedRef.current = normalized
      setIsSearching(true)
      setError(null)
      setShowSuggestions(false)

      try {
        const pokemon = await fetchPokemon(normalized)
        const wasSet = setPokemon(kind, index, pokemon)

        if (!wasSet) {
          setError('Este Pokémon ya está en el equipo')
        } else {
          setQuery('')
          lastSearchedRef.current = null
        }
      } catch (err) {
        if (err instanceof PokeApiError) {
          setError(
            err.code === 'not-found'
              ? 'No se encontró ese Pokémon'
              : err.code === 'network'
                ? 'Error de conexión'
                : 'Error inesperado'
          )
        } else {
          setError('Error inesperado')
        }
      } finally {
        isSearchingRef.current = false
        setIsSearching(false)
      }
    },
    [kind, index, setPokemon]
  )

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (!trimmed || trimmed === lastSearchedRef.current) return
    handleSearch(trimmed)
  }, [debouncedQuery, handleSearch])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setShowSuggestions(true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch(query)
    }
  }

  const selectSuggestion = (item: PokemonListItem) => {
    setQuery(item.name)
    setShowSuggestions(false)
    handleSearch(item.name)
  }

  const handleClear = () => {
    clearSlot(kind, index)
    setQuery('')
    lastSearchedRef.current = null
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          disabled={isSearching}
          placeholder={slot ? 'Buscar otro...' : 'Nombre o número'}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
        />
        <button
          type="button"
          onClick={() => handleSearch(query)}
          disabled={isSearching || !query.trim()}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSearching ? '...' : 'Buscar'}
        </button>
      </div>

      {showSuggestions && normalizedQuery && !isListLoading && (
        <ul className="max-h-48 overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(item)}
                  className="w-full px-3 py-2 text-left text-sm capitalize hover:bg-gray-100"
                >
                  {item.name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">Sin coincidencias</li>
          )}
        </ul>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {slot && (
        <div className="flex flex-col items-center gap-2">
          {slot.spriteUrl ? (
            <img
              src={slot.spriteUrl}
              alt={slot.name}
              className="h-24 w-24 object-contain"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500">
              Sin imagen
            </div>
          )}
          <p className="text-lg font-semibold capitalize">{slot.name}</p>
          <div className="flex flex-wrap justify-center gap-1">
            {slot.types.map((type) => (
              <span
                key={type}
                className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${TYPE_COLORS[type] ?? 'bg-gray-500'}`}
              >
                {type}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="mt-1 text-sm text-red-600 hover:text-red-800"
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  )
}
