export type ElementalType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export type Multiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4

export type TypeCount = {
  attackType: ElementalType
  debiles: { x2: number; x4: number }
  neutros: number
  resistentes: number
  inmunes: number
}

export type PokemonTypeAnalysis = {
  name: string
  spriteUrl: string
  debilidades: { type: ElementalType; multiplier: 2 | 4 }[]
  resistencias: { type: ElementalType; multiplier: 0.25 | 0.5 }[]
  inmunes: ElementalType[]
}

export type TeamTypeAnalysis = {
  rows: TypeCount[]
  pokemon: PokemonTypeAnalysis[]
}
