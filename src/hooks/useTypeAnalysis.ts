import { useMemo } from 'react'
import type { Teams, TeamKind } from '../types/pokemon.ts'
import type { TeamTypeAnalysis } from '../types/typeAnalysis.ts'
import { analyzeTeam } from '../utils/typeAnalysis.ts'

export const useTypeAnalysis = (
  teams: Teams
): Record<TeamKind, TeamTypeAnalysis> => {
  return useMemo(
    () => ({
      propio: analyzeTeam(teams.propio),
      rival: analyzeTeam(teams.rival),
    }),
    [teams]
  )
}
