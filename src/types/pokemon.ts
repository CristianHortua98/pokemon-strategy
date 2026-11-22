export type PokemonSummary = {
  id: number
  name: string
  spriteUrl: string
  types: string[]
}

export type PokemonListItem = {
  id: number
  name: string
}

export type TeamKind = 'propio' | 'rival'
export type TeamSlot = PokemonSummary | null
export type Teams = Record<TeamKind, TeamSlot[]>
