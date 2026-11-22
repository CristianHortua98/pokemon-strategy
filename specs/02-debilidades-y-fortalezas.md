# SPEC 02 — Debilidades y fortalezas de tipos por equipo

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-22
> **Objetivo:** Apartado bajo los dos equipos que muestra, para tu equipo y el rival, a qué tipos son débiles y a cuáles no (con conteos por tipo ordenados por gravedad) junto al desglose de multiplicadores de cada Pokémon, calculado en local con la tabla 18×18 y los tipos base de los Pokémon elegidos.

## Alcance

**Incluye:**

- Nueva sección "Debilidades y fortalezas" debajo de las dos rejillas de equipos, con un bloque por equipo ("Tu equipo" y "Equipo rival").
- Cada bloque muestra una fila por cada uno de los 18 tipos atacantes, ordenadas por gravedad: nº de débiles (desc), presencia de x4, nº de neutros (desc), nº de inmunes (desc), nº de resistentes (desc), y orden canónico como desempate final.
- Cada fila muestra conteos por categoría, omitiendo las categorías con cero: `Hielo — 2 débiles (1 con x4) · 3 resistentes · 1 inmune`. Si todas las categorías son cero, la fila muestra `neutro`.
- Las categorías son: débiles (x2/x4), resistentes (½/¼) e inmunes (x0). El neutro (x1) no se muestra como categoría; su conteo solo se usa para ordenar.
- El x4 se destaca en la fila entre paréntesis, junto a la cuenta de débiles.
- Mini-fichas por cada Pokémon del equipo: sprite, nombre y chips de debilidades (x2/x4), resistencias (½/¼) e inmunidades (x0).
- Actualización reactiva cuando se añade, reemplaza o vacía un Pokémon.
- Nombres de tipos en español (`Hielo`, `Roca`, `Tierra`) mediante un mapa local; los datos internos siguen en inglés como en SPEC 01.

**Fuera de alcance (specs futuras):**

- Configuración y efecto de movimientos, objetos y habilidades del rival (p. ej. Levitación, Absorbe Voltios).
- Recomendaciones estratégicas cruzadas entre equipos.
- Nombres de Pokémon en español.
- Interacción con la tabla (filtrar o resaltar tipos/Pokémon).
- Formas y variantes: los tipos vienen de la forma base ya devuelta por SPEC 01.

## Modelo de datos

```ts
// src/types/typeAnalysis.ts
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
  rows: TypeCount[]           // 18 filas ordenadas por gravedad
  pokemon: PokemonTypeAnalysis[]
}
```

```ts
// src/data/typeChart.ts
export const TYPE_ORDER: ElementalType[]                   // orden canónico (desempate)
export const TYPE_NAMES_ES: Record<ElementalType, string>  // 'ice' → 'Hielo'
export const TYPE_EFFECTIVENESS: Record<
  ElementalType,
  Partial<Record<ElementalType, Multiplier>>
>
// fila = tipo atacante, columna = tipo defensor; solo se codifican las casillas ≠ x1.
// getMultiplier(attack, defenseTypes) multiplica las dos mitades y devuelve 1 por defecto.
```

Esta spec no añade persistencia: todo se recalcula desde `Teams` (SPEC 01) en cada render con `useMemo`.

## Plan de implementación

1. Crear `src/types/typeAnalysis.ts` con los tipos anteriores.
2. Crear `src/data/typeChart.ts` con la matriz 18×18 de la gen IX (solo casillas ≠ x1), `TYPE_ORDER` y `TYPE_NAMES_ES`. Prueba manual: `TYPE_EFFECTIVENESS['rock']['flying'] === 2` y `TYPE_EFFECTIVENESS['ice']['dragon'] === 2`, por lo que un Charizard (fuego/volador) recibe x4 de Roca.
3. Crear `src/utils/typeAnalysis.ts` con `getMultiplier(attack, defenseTypes): Multiplier`, `analyzePokemon(slot): PokemonTypeAnalysis` y `analyzeTeam(slots): TeamTypeAnalysis` (18 filas, conteos y comparador de gravedad).
4. Crear `src/hooks/useTypeAnalysis.ts` — `useTypeAnalysis(teams): Record<TeamKind, TeamTypeAnalysis>` con `useMemo`.
5. Crear `src/components/TeamTypeSummary.tsx` — bloque por equipo: mensaje vacío si los 6 slots son `null`; si no, tabla de 18 filas + mini-fichas de cada Pokémon.
6. Crear `src/components/PokemonTypeCard.tsx` — mini-ficha con sprite, nombre y chips de debilidades/resistencias/inmunidades.
7. Crear `src/components/TypeAnalysisSection.tsx` — título de sección y dos bloques con `useTypeAnalysis`.
8. Componer en `src/PokemonStrategy.tsx` — `<TypeAnalysisSection teams={teams} />` tras las dos `TeamSection`.
9. Ejecutar `npm run build` y `npm run lint` y corregir fallos.

## Criterios de aceptación

- [ ] La sección "Debilidades y fortalezas" aparece debajo de las dos rejillas al cargar.
- [ ] Con un equipo vacío, su bloque muestra "Selecciona Pokémon para ver el análisis" y el otro bloque funciona con normalidad.
- [ ] Buscar "charizard" en un cuadro de "Tu equipo" hace que la fila "Roca" del resumen muestre "1 débil (con x4)".
- [ ] La ficha de Charizard muestra "Roca x4" y "Tierra x0".
- [ ] El resumen de ese equipo no cuenta a Charizard como débil a Tierra (es inmune por Volador).
- [ ] Los 18 tipos aparecen siempre en cada bloque con equipo, ordenados por gravedad; los tipos sin categorías destacables muestran "neutro".
- [ ] Las categorías con cero Pokémon se omiten en cada fila.
- [ ] Al añadir un segundo Pokémon débil a Hielo, la fila "Hielo" pasa delante de filas con menos débiles.
- [ ] Los tipos se muestran en español ("Hielo", "Roca") y los Pokémon siguen en inglés.
- [ ] Vaciar o reemplazar un Pokémon actualiza el resumen y las fichas de su equipo al instante, sin recargar.
- [ ] El bloque "Equipo rival" refleja solo los Pokémon del rival, y el propio solo los propios.
- [ ] `npm run build` y `npm run lint` pasan sin errores.

## Decisiones

- **Sí:** matriz 18×18 local (gen IX) en `src/data/typeChart.ts`. Sin red ni puntos de fallo; la tabla no cambia con el tiempo.
- **No:** consultar `/type` de PokeAPI — añadiría peticiones extra y rate limit para datos estáticos.
- **Sí:** tipos en español con mapa local (`TYPE_NAMES_ES`), claves internas en inglés — la UI es en español; los nombres de Pokémon siguen en inglés como en SPEC 01.
- **Sí:** orden por gravedad: nº de débiles desc, x4 presente, nº de neutros desc, nº de inmunes desc, nº de resistentes desc, orden canónico como desempate.
- **No:** orden fijo canónico — se consideró para comparar equipos fila a fila, pero el usuario prefirió ver primero las amenazas.
- **Sí:** conteos por categoría en la fila; categorías a cero se omiten; "neutro" cuando no hay nada que destacar.
- **No:** chips por Pokémon en la fila — el detalle por slot ya vive en las mini-fichas.
- **Sí:** desglose por Pokémon dentro del apartado de análisis.
- **No:** modificar `PokemonSlot` — la spec solo añade componentes; el cuadro de selección queda intacto.
- **Sí:** solo tipos base. **No:** habilidades como Levitación — la configuración de habilidades aún no existe y merece su propia spec.
- **Sí:** análisis derivado con `useMemo` desde `Teams`; sin persistencia nueva.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Error de transcripción en la matriz 18×18 | Casos conocidos verificados en criterios (Roca x4 a Charizard, Tierra x0 a Volador); revisión manual de las casillas ≠ x1 frente a la tabla oficial. |
| Tipos desconocidos provenientes de localStorage corrupto | `getMultiplier` trata tipos fuera de la unión como neutros (x1); SPEC 01 ya valida la estructura al cargar. |
| Orden por gravedad poco intuitivo | Definido explícitamente en esta spec; ajustable sin cambiar datos. |

## Lo que **no** está en esta spec

- Configuración de movimientos, objeto y habilidad del rival y su efecto en el análisis.
- Recomendaciones estratégicas cruzadas entre equipos.
- Nombres de Pokémon en español.
- Interacción con la tabla (filtrar o resaltar).

Cada una, si llega, va en su propia spec.
