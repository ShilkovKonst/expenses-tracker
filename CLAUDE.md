# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpendObserver — a local-first expense tracking web app. All data is stored in the browser via IndexedDB; there is no backend database. Built with Next.js 15 (App Router), React 19, TypeScript 5, and Tailwind CSS 4.

## Commands

- `npm run dev` — dev server with Turbopack
- `npm run dev:https` — dev server with HTTPS (requires local SSL certs)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint (flat config, extends next/core-web-vitals and next/typescript)

- `npm run test` — run all tests once (Vitest)
- `npm run test:watch` — run tests in watch mode

### Testing

Vitest + React Testing Library (happy-dom environment). Config in `vitest.config.mts`. Tests live alongside source in `__tests__/` directories following the pattern `*.test.{ts,tsx}`. Setup file at `src/tests/setup.ts` (imports `fake-indexeddb/auto` for IDB tests). Use `vi.fn()` for mocks and `@testing-library/user-event` for interaction simulation. 198 tests across 25 files covering utilities, locale, contexts, form components, and the full IndexedDB CRUD layer.

## Architecture

### Routing & Localization

Next.js App Router with locale-based routing: `src/app/[locale]/`. Middleware (`src/middleware.ts`) detects Accept-Language and redirects to one of three locales: `en`, `ru`, `fr`. Translations live in `src/locales/` as JSON files, accessed via `t(locale, "path.to.key")` with `{{varName}}` interpolation.

### API Routes

Internal API at `src/app/api/[tracker]/[entity]/[id]/route.ts`. These routes handle CRUD for tracker entities using FormData-based communication.

### State Management (React Context)

Four contexts composed in `src/context/AppProviders.tsx`:
1. **GlobalContext** — locale, all trackers metadata, loading state, charts toggle
2. **TrackerContext** — current tracker's data (meta, tags, years)
3. **FlashContext** — notification/flash messages
4. **ModalContext** — type-safe modal registry using a `ModalMap` discriminated union

### Data Storage (IndexedDB)

Each tracker gets its own IndexedDB database (named by tracker ID) with 5 object stores: MetadataStore, TagsStore, YearsStore, MonthsStore, RecordsStore. All IDB logic is in `src/idb/`:
- `IDBManager.ts` — database lifecycle, connection caching
- `CRUD/` — per-entity CRUD operations (metaCRUD, recordsCRUD, tagsCRUD, yearsCRUD, monthsCRUD)
- `massImportHelper.ts` — batch import/retrieval
- `apiHelpers/` — FormData parsers and entity creation utilities

### Data Model

Core types in `src/lib/types/dataTypes.ts`:
- **Tracker** = { meta, tags, years, totalAmount }
- **MonthRecord** = { id, year, month, day, type ("income"|"cost"), tags, description, amount }
- Years contain months, months contain records. Tags are shared per tracker.

### Branded Types

`src/lib/types/brand.ts` defines branded types (TrackerId, TagId, YearId, MonthId, RecordId) using a `Brand<T, B>` pattern with unique symbols. Always use the factory functions (`createTrackerId()`, etc.) to construct IDs.

### Amount Handling

Amounts are stored as integers (cents): `Math.round(amount * 100)`. The amount input field supports inline calculator expressions (`5+10/2*3`). See `src/lib/utils/amountHelper.ts` for `calcExpression()` and `calcExpressionAlg()`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Component Naming

Components use a "Block" suffix convention: `HeaderBlock`, `AccordionBlock`, `RecordBlock`, `FormAmountBlock`, etc. Modals: `RecordModal`, `DeleteModal`, `SettingsModal`, `TrackerModal`.

### Validation

`src/lib/utils/dataValidator.ts` provides comprehensive validation for tracker data on import with localized error messages.
