import { TYPE_NAMES_ES } from '../data/typeChart.ts'
import type { TeamTypeAnalysis, TypeCount } from '../types/typeAnalysis.ts'
import { PokemonTypeCard } from './PokemonTypeCard.tsx'

type TeamTypeSummaryProps = {
  title: string
  analysis: TeamTypeAnalysis
}

const formatRow = (row: TypeCount): string => {
  const parts: string[] = []
  const totalDebil = row.debiles.x2 + row.debiles.x4

  if (totalDebil > 0) {
    let text = `${totalDebil} débil${totalDebil !== 1 ? 'es' : ''}`
    if (row.debiles.x4 > 0) {
      text += ` (${row.debiles.x4} con x4)`
    }
    parts.push(text)
  }

  if (row.resistentes > 0) {
    parts.push(
      `${row.resistentes} resistente${row.resistentes !== 1 ? 's' : ''}`
    )
  }

  if (row.inmunes > 0) {
    parts.push(`${row.inmunes} inmune${row.inmunes !== 1 ? 's' : ''}`)
  }

  return parts.length > 0 ? parts.join(' · ') : 'neutro'
}

export const TeamTypeSummary = ({ title, analysis }: TeamTypeSummaryProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {analysis.pokemon.length === 0 ? (
        <p className="text-gray-500">
          Selecciona Pokémon para ver el análisis
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-1">
            {analysis.rows.map((row) => (
              <div
                key={row.attackType}
                className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-gray-50"
              >
                <span className="font-medium">
                  {TYPE_NAMES_ES[row.attackType]}
                </span>
                <span className="text-sm text-gray-700">
                  {formatRow(row)}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.pokemon.map((pokemon) => (
              <PokemonTypeCard key={pokemon.name} analysis={pokemon} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
