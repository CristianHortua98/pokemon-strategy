# Agent Instructions — Pokémon Strategy

This repository is a React + TypeScript + Vite web application for building Pokémon teams and getting strategic recommendations. Agents working here should follow the commands and conventions below.

## Project Stack

- **Framework:** React 19 with StrictMode
- **Language:** TypeScript 6 with `type: "module"`
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4 (imported in `src/index.css`)
- **Compiler:** React Compiler enabled via `@vitejs/plugin-react` + `@rolldown/plugin-babel`
- **Linting:** ESLint 10 with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Tests:** No test runner is configured yet. Add one explicitly if requested.

## Available Commands

Run all commands from the repository root.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview

# Lint the whole codebase
npm run lint

# Run a single file or test — not available until a test runner is installed
```

> If you add a test framework such as Vitest, expose `npm test` and `npm run test:ui` (or equivalent) and document how to run a single test file and a single test case here.

## Build Verification

Before finishing any non-trivial change, run the following in order:

1. `npm run build` — verifies TypeScript compilation and Vite bundling.
2. `npm run lint` — verifies ESLint passes.

Fix any failures from these commands before reporting the task complete.

## Code Style

### TypeScript

- Target ES2023 and the `DOM` / `ES2023` libs (`tsconfig.app.json`).
- Use `bundler` module resolution and import `.ts`/`.tsx` files with their extension, e.g. `import App from './App.tsx'`.
- Enable and respect strict compiler checks: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`.
- Prefer `type` over `interface` for simple shapes, but stay consistent with the surrounding code.
- Avoid `any`. Use `unknown` and narrow explicitly when types are uncertain.
- Use `satisfies` when you want to validate a literal without widening.

### Imports and Exports

- Use ES modules. Named exports are preferred for reusable components and utilities.
- Group imports in this order, separated by a blank line:
  1. External libraries (React, etc.)
  2. Absolute internal aliases (none configured yet)
  3. Relative imports (components, hooks, utils)
- Keep import paths relative for files inside `src` until a path alias is configured.
- Clean up unused imports; `noUnusedLocals` will fail the build.

### React Components

- Write components as arrow functions with explicit named exports.
- Example:
  ```tsx
  export const PokemonStrategy = () => {
    return <div>...</div>
  }
  ```
- Keep components focused on one responsibility; split large components into smaller ones.
- React Compiler is active — follow the Rules of React:
  - Only call hooks at the top level.
  - Only call hooks from React functions.
  - Mutate refs and state immutably.
  - Memoize expensive calculations with `useMemo` when appropriate.

### Naming Conventions

- Components: PascalCase files and exported names (`PokemonStrategy.tsx`, `PokemonStrategy`).
- Hooks: camelCase starting with `use` (`useTeamAnalysis`).
- Utilities and types: camelCase for values, PascalCase for types.
- CSS classes: use Tailwind utility classes directly on JSX; avoid custom class names when possible.

### Formatting

- No explicit formatter is configured. Keep code consistent with the existing two-space indentation.
- Use single quotes for strings and JSX attributes unless escaping is needed.
- Prefer implicit returns for simple components and arrow functions.
- Add a trailing comma in multi-line arrays, objects, and function parameters.

### Styling with Tailwind

- Import Tailwind via `@import "tailwindcss";` in `src/index.css` only.
- Prefer utility classes over custom CSS. If custom styles are unavoidable, add them in `src/index.css`.
- Use responsive prefixes (`sm:`, `md:`, `lg:`) for layout changes rather than media queries.

### Error Handling

- Handle async errors at the call site. Prefer `try/catch` with typed or discriminated errors.
- For React render errors, consider adding an Error Boundary if the feature warrants it.
- Validate external data (API responses, user input) before casting; never assume the shape matches the type.
- Log errors to the console only during development; avoid shipping debug logs.

## Project Layout

- `src/` — application source code.
- `src/App.tsx` — root component.
- `src/main.tsx` — application entry point.
- `src/index.css` — global styles and Tailwind import.
- `public/` — static assets served at the root.
- `specs/` — spec-driven design documents. Follow the format in `.agents/skills/spec/template.md`.
- `dist/` — build output (ignored by ESLint and Git).

## External Rules

No Cursor rules (`.cursorrules` or `.cursor/rules/`) and no GitHub Copilot instructions (`.github/copilot-instructions.md`) were found in this repository. If any are added later, merge their guidance into this file.

## Communication

- README and UI text are in Spanish; code, comments, and spec documents should generally stay in Spanish when the surrounding context is Spanish.
- Keep user-facing messages clear and concise.
- Do not commit secrets, API keys, or environment files.

## Workflow Reminders

- Read `README.md` and existing `specs/` before large features.
- For sizable changes, create or follow a spec using the `/spec` skill first.
- Run `npm run build` and `npm run lint` before considering a task done.
- Never commit unless explicitly asked.
