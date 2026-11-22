# SPEC 01 — Selección de equipos: 6 Pokémon propios y 6 rivales

> **Estado:** Aprobado
> **Depende de:** ninguna
> **Fecha:** 2026-11-22
> **Objetivo:** Página con 12 cuadros donde cada cuadro sugiere Pokémon mientras se escribe y los busca por nombre o número contra PokeAPI (con debounce de 5s o al pulsar Enter/botón) para mostrar nombre, imagen y tipos.

## Alcance

**Incluye:**

- Página con dos secciones, "Tu equipo" y "Equipo rival", cada una con 6 cuadros.
- Cada cuadro tiene un campo de texto con autocompletado: muestra sugerencias filtradas desde una lista precargada de nombres/IDs de Pokémon.
- La búsqueda de detalles se dispara al pulsar Enter, al hacer clic en el botón "Buscar" o al seleccionar una sugerencia.
- También se ejecuta automáticamente si se deja de escribir durante 5 segundos y el texto coincide con un nombre o número válido.
- Cada cuadro muestra nombre, imagen (sprite) y tipos del Pokémon elegido.
- Reemplazar y vaciar el Pokémon de cualquier cuadro.
- Sin duplicados dentro de un mismo equipo; el mismo Pokémon sí puede estar en ambos equipos.
- Persistencia de los 12 Pokémon en localStorage, restaurada al recargar.
- Estados por cuadro: vacío, cargando, elegido y error (no encontrado o fallo de red).

**Fuera de alcance (specs futuras):**

- Configuración de movimientos, objeto y habilidad del equipo rival.
- Recomendaciones estratégicas.
- Formas y variantes (mega, regionales): solo formas base.
- Nombres localizados en español.

## Modelo de datos

```ts
// src/types/pokemon.ts
export type PokemonSummary = {
  id: number
  name: string       // nombre en inglés, tal como lo devuelve la API
  spriteUrl: string  // sprites.front_default
  types: string[]    // p. ej. ['fire', 'flying'], en inglés
}

export type PokemonListItem = {
  id: number
  name: string
}

export type TeamKind = 'propio' | 'rival'
export type TeamSlot = PokemonSummary | null  // null = cuadro vacío
export type Teams = Record<TeamKind, TeamSlot[]>  // cada array: longitud fija 6
```

Clave de persistencia: `pokemon-strategy:teams:v1` — guarda ambos arrays completos.

## Plan de implementación

1. Crear `src/types/pokemon.ts` con los tipos anteriores.
2. Crear `src/api/pokeapi.ts` con `fetchPokemon(idOrName: string): Promise<PokemonSummary>` — normaliza la entrada, mapea la respuesta y lanza errores tipados.
3. Crear `src/api/pokemonList.ts` con `fetchAllPokemon(): Promise<PokemonListItem[]>` — carga los nombres y IDs de todas las formas base en una sola llamada.
4. Crear `src/hooks/useDebounce.ts` — devuelve el valor debounced tras un retardo configurable.
5. Crear `src/hooks/useTeams.ts` — estado de ambos equipos, operaciones de asignar/reemplazar/vaciar un slot, bloqueo de duplicados dentro del equipo, y persistencia en `pokemon-strategy:teams:v1`.
6. Crear `src/components/PokemonSlot.tsx` — un cuadro con autocompletado, debounce de 5s, búsqueda con Enter/botón/sugerencia, y botones de reemplazar y quitar. Prueba manual: buscar "charizard", "6" y seleccionar una sugerencia.
7. Crear `src/components/TeamSection.tsx` — título + rejilla de 6 `PokemonSlot`.
8. Componer la página en `src/PokemonStrategy.tsx` — dos `TeamSection` alimentadas por `useTeams`.
9. Ejecutar `npm run build` y `npm run lint` y corregir fallos.

## Criterios de aceptación

- [ ] La página muestra "Tu equipo" y "Equipo rival" con 6 cuadros cada una al cargar.
- [ ] Al escribir en un cuadro se muestran sugerencias de Pokémon que coinciden con el texto.
- [ ] Hacer clic en una sugerencia busca ese Pokémon y lo muestra en el cuadro.
- [ ] Dejar de escribir durante 5 segundos con un nombre o número válido busca automáticamente.
- [ ] Buscar "charizard" con Enter muestra nombre, imagen y tipos en ese cuadro.
- [ ] Buscar "6" (número) funciona igual que por nombre.
- [ ] Un nombre inexistente muestra error dentro del cuadro y la página sigue funcionando.
- [ ] Mientras llega la respuesta, el cuadro muestra estado de carga.
- [ ] Un Pokémon ya presente en el mismo equipo queda bloqueado; puede repetirse en el rival.
- [ ] Cada cuadro permite reemplazar y vaciar el Pokémon elegido.
- [ ] Recargar la página restaura los 12 Pokémon elegidos.
- [ ] `npm run build` y `npm run lint` pasan sin errores.

## Decisiones

- **Sí:** búsqueda por nombre inglés o número contra `pokemon/{id-name}` — es lo que soporta el endpoint citado.
- **No:** nombres en español — exigiría traducir con `/pokemon-species` antes de consultar.
- **Sí:** autocompletado con lista precargada de nombres/IDs, filtrada client-side.
- **Sí:** búsqueda inmediata al pulsar Enter, el botón "Buscar" o al seleccionar una sugerencia.
- **Sí:** búsqueda automática tras 5 segundos sin escribir si el texto es un nombre o número válido.
- **No:** búsqueda por cada tecla sin debounce — se evita saturar la API.
- **Sí:** sin duplicados dentro de un equipo (cláusula de especies); duplicado entre equipos permitido.
- **Sí:** localStorage con clave versionada `pokemon-strategy:teams:v1`.
- **No:** IndexedDB o backend — sobreingeniería para dos arrays de 6.
- **Sí:** solo formas base — las variantes quedan fuera.
- **Sí:** solo selección en esta spec — la configuración rival (movimientos/objeto/habilidad) merece su propia spec y alimentará las recomendaciones futuras.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Rate limit o caída de PokeAPI | Error por cuadro; la página no necesita la API para cargar. |
| Lista de nombres grande en memoria | Se carga una vez por sesión; ~1MB JSON, aceptable para navegadores modernos. |
| localStorage deshabilitado | try/catch al leer y guardar; la app funciona sin persistencia. |
| Nombres con espacios o puntos ("mr. mime") | Normalizar entrada: trim, minúsculas, espacios a guiones ("mr-mime"). |
| Esquema persistido incompatible futuro | La clave lleva `:v1`; migración en `useTeams.ts`. |

## Lo que **no** está en esta spec

- Configuración de movimientos, objeto y habilidad del rival.
- Recomendaciones estratégicas.
- Formas/variantes y nombres en español.

Cada una de esas, si llega, va en su propia spec.
