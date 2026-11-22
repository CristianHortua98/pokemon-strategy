import { TeamSection } from './components/TeamSection.tsx'
import { useTeams } from './hooks/useTeams.ts'

export const PokemonStrategy = () => {
  const { teams, setPokemon, clearSlot } = useTeams()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Pokémon Strategy</h1>
      <div className="flex flex-col gap-12">
        <TeamSection
          kind="propio"
          title="Tu equipo"
          slots={teams.propio}
          setPokemon={setPokemon}
          clearSlot={clearSlot}
        />
        <TeamSection
          kind="rival"
          title="Equipo rival"
          slots={teams.rival}
          setPokemon={setPokemon}
          clearSlot={clearSlot}
        />
      </div>
    </main>
  )
}
