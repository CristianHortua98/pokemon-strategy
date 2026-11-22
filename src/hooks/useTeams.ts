import { useCallback, useEffect, useState } from 'react'
import type { PokemonSummary, Teams, TeamKind, TeamSlot } from '../types/pokemon.ts'

const STORAGE_KEY = 'pokemon-strategy:teams:v1'

const EMPTY_TEAMS: Teams = {
  propio: [null, null, null, null, null, null],
  rival: [null, null, null, null, null, null],
}

const isPokemonSummary = (value: unknown): value is PokemonSummary => {
  if (typeof value !== 'object' || value === null) return false
  const pokemon = value as Record<string, unknown>

  return (
    typeof pokemon.id === 'number' &&
    typeof pokemon.name === 'string' &&
    typeof pokemon.spriteUrl === 'string' &&
    Array.isArray(pokemon.types) &&
    pokemon.types.every((type) => typeof type === 'string')
  )
}

const isValidTeamArray = (value: unknown): value is TeamSlot[] =>
  Array.isArray(value) &&
  value.length === 6 &&
  value.every((slot) => slot === null || isPokemonSummary(slot))

const isValidTeams = (value: unknown): value is Teams => {
  if (typeof value !== 'object' || value === null) return false
  const teams = value as Record<string, unknown>
  return isValidTeamArray(teams.propio) && isValidTeamArray(teams.rival)
}

const loadTeams = (): Teams => {
  if (typeof window === 'undefined') return EMPTY_TEAMS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_TEAMS

    const parsed = JSON.parse(raw) as unknown
    if (!isValidTeams(parsed)) return EMPTY_TEAMS

    return parsed
  } catch {
    return EMPTY_TEAMS
  }
}

const saveTeams = (teams: Teams): void => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
  } catch {
    // localStorage deshabilitado o lleno; se ignora silenciosamente.
  }
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Teams>(loadTeams)

  useEffect(() => {
    saveTeams(teams)
  }, [teams])

  const setPokemon = useCallback(
    (kind: TeamKind, index: number, pokemon: PokemonSummary): boolean => {
      if (index < 0 || index >= 6) return false

      const isDuplicate = teams[kind].some(
        (slot, slotIndex) => slotIndex !== index && slot?.id === pokemon.id
      )

      if (isDuplicate) return false

      setTeams((previous) => ({
        ...previous,
        [kind]: previous[kind].map((slot, slotIndex) =>
          slotIndex === index ? pokemon : slot
        ),
      }))

      return true
    },
    [teams]
  )

  const clearSlot = useCallback((kind: TeamKind, index: number): void => {
    if (index < 0 || index >= 6) return

    setTeams((previous) => ({
      ...previous,
      [kind]: previous[kind].map((slot, slotIndex) =>
        slotIndex === index ? null : slot
      ),
    }))
  }, [])

  return { teams, setPokemon, clearSlot }
}
