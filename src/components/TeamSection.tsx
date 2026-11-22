import { PokemonSlot } from './PokemonSlot.tsx'
import type { PokemonSummary, TeamKind, TeamSlot } from '../types/pokemon.ts'

type TeamSectionProps = {
  kind: TeamKind
  title: string
  slots: TeamSlot[]
  setPokemon: (kind: TeamKind, index: number, pokemon: PokemonSummary) => boolean
  clearSlot: (kind: TeamKind, index: number) => void
}

export const TeamSection = ({
  kind,
  title,
  slots,
  setPokemon,
  clearSlot,
}: TeamSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, index) => (
          <PokemonSlot
            key={`${kind}-${index}`}
            kind={kind}
            index={index}
            slot={slot}
            setPokemon={setPokemon}
            clearSlot={clearSlot}
          />
        ))}
      </div>
    </section>
  )
}
