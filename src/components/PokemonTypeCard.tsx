import { TYPE_NAMES_ES } from '../data/typeChart.ts'
import type { PokemonTypeAnalysis } from '../types/typeAnalysis.ts'

type PokemonTypeCardProps = {
  analysis: PokemonTypeAnalysis
}

export const PokemonTypeCard = ({ analysis }: PokemonTypeCardProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <img
          src={analysis.spriteUrl}
          alt={analysis.name}
          className="h-8 w-8 object-contain"
        />
        <span className="font-medium capitalize">{analysis.name}</span>
      </div>
      {analysis.debilidades.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {analysis.debilidades.map(({ type, multiplier }) => (
            <span
              key={`weak-${type}`}
              className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
            >
              {multiplier === 4 ? 'x4' : 'x2'} {TYPE_NAMES_ES[type]}
            </span>
          ))}
        </div>
      )}
      {(analysis.resistencias.length > 0 || analysis.inmunes.length > 0) && (
        <div className="flex flex-wrap gap-1">
          {analysis.resistencias.map(({ type, multiplier }) => (
            <span
              key={`res-${type}`}
              className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
            >
              {multiplier === 0.25 ? '¼' : '½'} {TYPE_NAMES_ES[type]}
            </span>
          ))}
          {analysis.inmunes.map((type) => (
            <span
              key={`imm-${type}`}
              className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
            >
              x0 {TYPE_NAMES_ES[type]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
