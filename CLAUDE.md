## Project
Taaable is a Google Sheets clone SPA, built as a portfolio project. Live: https://aksenov-dev.github.io/taaable/

**Stack:**
- Vue 3 + Composition API + TypeScript
- Vite (build), Vue Router, Pinia (state)
- Tailwind CSS v4, @floating-ui/vue, @vueuse/core
- IndexedDB (idb) — all persistence is client-side, no backend
- Vitest (tests), ESLint (@antfu/eslint-config)

**Architecture:**
- `src/stores/` — Pinia stores: `tables`, `table`, `sheets`, `settings`, `sheetsData/{cells,rows,columns}`
- `src/db/` — storage layer: `database.ts` initializes IndexedDB (6 object stores), separate storage modules per entity
- `src/composables/` — reusable logic: keyboard navigation, column/row resize, scroll, cell editing
- `src/components/` — UI by feature: HomeView (table list) and TableView (editor with toolbar, formula bar, grid, sheet tab footer)
- `src/shared/` — types, utilities (entity factories, DTO↔Domain transforms), constants

**Key domain concepts:**
- Table → contains Sheets → each Sheet contains Cells, Rows, Columns
- All IDs generated with nanoid
- Data saved atomically via IDB transactions

## Language
- Always respond in Russian
- Code, variable names, and comments in code — in English (as usual)
- Technical terms can stay in English where a Russian equivalent sounds unnatural
