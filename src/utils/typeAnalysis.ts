import { TYPE_EFFECTIVENESS, TYPE_ORDER } from '../data/typeChart.ts'
import type { TeamSlot } from '../types/pokemon.ts'
import type {
  ElementalType,
  Multiplier,
  PokemonTypeAnalysis,
  TeamTypeAnalysis,
  TypeCount,
} from '../types/typeAnalysis.ts'

export const getMultiplier = (
  attackType: ElementalType,
  defenseTypes: string[]
): Multiplier => {
  if (defenseTypes.length === 0) return 1

  let result = 1

  for (const defenseType of defenseTypes) {
    const effectiveness =
      TYPE_EFFECTIVENESS[attackType][defenseType as ElementalType]
    if (effectiveness === undefined) continue
    result *= effectiveness
  }

  return result as Multiplier
}

export const analyzePokemon = (
  slot: TeamSlot
): PokemonTypeAnalysis | null => {
  if (slot === null) return null

  const debilidades: PokemonTypeAnalysis['debilidades'] = []
  const resistencias: PokemonTypeAnalysis['resistencias'] = []
  const inmunes: PokemonTypeAnalysis['inmunes'] = []

  for (const attackType of TYPE_ORDER) {
    const multiplier = getMultiplier(attackType, slot.types)

    if (multiplier === 4 || multiplier === 2) {
      debilidades.push({ type: attackType, multiplier })
    } else if (multiplier === 0.5 || multiplier === 0.25) {
      resistencias.push({ type: attackType, multiplier })
    } else if (multiplier === 0) {
      inmunes.push(attackType)
    }
  }

  return {
    name: slot.name,
    spriteUrl: slot.spriteUrl,
    debilidades,
    resistencias,
    inmunes,
  }
}

export const analyzeTeam = (slots: TeamSlot[]): TeamTypeAnalysis => {
  const pokemon = slots
    .map(analyzePokemon)
    .filter((analysis): analysis is PokemonTypeAnalysis => analysis !== null)

  const rows: TypeCount[] = TYPE_ORDER.map((attackType) => {
    const typeCount: TypeCount = {
      attackType,
      debiles: { x2: 0, x4: 0 },
      neutros: 0,
      resistentes: 0,
      inmunes: 0,
    }

    for (const analysis of pokemon) {
      const debil = analysis.debilidades.find(({ type }) => type === attackType)

      if (debil) {
        if (debil.multiplier === 4) {
          typeCount.debiles.x4 += 1
        } else {
          typeCount.debiles.x2 += 1
        }
      } else if (analysis.resistencias.some(({ type }) => type === attackType)) {
        typeCount.resistentes += 1
      } else if (analysis.inmunes.includes(attackType)) {
        typeCount.inmunes += 1
      } else {
        typeCount.neutros += 1
      }
    }

    return typeCount
  })

  const sortedRows = [...rows].sort((a, b) => {
    const aDebil = a.debiles.x2 + a.debiles.x4
    const bDebil = b.debiles.x2 + b.debiles.x4
    if (aDebil !== bDebil) return bDebil - aDebil

    const aHasX4 = a.debiles.x4 > 0 ? 1 : 0
    const bHasX4 = b.debiles.x4 > 0 ? 1 : 0
    if (aHasX4 !== bHasX4) return bHasX4 - aHasX4

    if (a.neutros !== b.neutros) return b.neutros - a.neutros
    if (a.inmunes !== b.inmunes) return b.inmunes - a.inmunes
    if (a.resistentes !== b.resistentes) return b.resistentes - a.resistentes

    return TYPE_ORDER.indexOf(a.attackType) - TYPE_ORDER.indexOf(b.attackType)
  })

  return { rows: sortedRows, pokemon }
}
