import { useTypeAnalysis } from '../hooks/useTypeAnalysis.ts'
import type { Teams } from '../types/pokemon.ts'
import { TeamTypeSummary } from './TeamTypeSummary.tsx'

type TypeAnalysisSectionProps = {
  teams: Teams
}

export const TypeAnalysisSection = ({ teams }: TypeAnalysisSectionProps) => {
  const analysis = useTypeAnalysis(teams)

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Debilidades y fortalezas</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TeamTypeSummary title="Tu equipo" analysis={analysis.propio} />
        <TeamTypeSummary title="Equipo rival" analysis={analysis.rival} />
      </div>
    </section>
  )
}
