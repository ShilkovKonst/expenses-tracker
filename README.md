<img src="public/tracker-logo.svg" alt="SpendObserver logo" width="64" />

# SpendObserver

A local-first expense tracking web app focused on privacy, flexibility, and full control over personal financial data. All data is stored directly in the browser — no backend, no accounts, no data leaves your device.

## Features

### Financial Records

Create, update, and delete income and expense records organized by year and month.

Each record supports:
- **Income / Cost** type classification
- **Custom tags** for categorization
- **Optional description**
- **Built-in inline calculator** — type expressions like `120+50/2` directly in the amount field and evaluate them with one click

### Multiple Trackers

Create and manage multiple independent trackers — useful for separating personal, family, work, or project expenses. Each tracker stores its data in an isolated IndexedDB database.

### Tag Management

Add, rename, and delete custom tags. Tags are shared across all records within a tracker and can be applied to multiple records simultaneously.

### Charts & Analytics

Visualize your financial data with interactive charts:
- Cost and income breakdown by tag
- Record quantity distribution
- Most-used and most-expensive tags
- Year and month-level navigation
- Overview statistics with tag-based filtering

### Import / Export

- Export any tracker to a JSON file for backup
- Import trackers from files — with options to merge or replace existing data
- Transfer data between devices or browsers

### Local-First Storage

- No server, no database, no account registration
- All data lives in the browser's IndexedDB
- Data persists across sessions and survives page refreshes
- Nothing is ever transmitted externally

### Progressive Web App

- Installable on desktop and mobile as a standalone app
- Offline support via Service Worker

### Internationalization

Available in **English**, **French**, and **Russian**. Language is detected automatically from the browser's `Accept-Language` header.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Charts | Recharts |
| Storage | IndexedDB (browser-native) |
| i18n | Custom locale routing + JSON translations |
| Testing | Vitest, React Testing Library, happy-dom |
| Build | Turbopack |

---

## Getting Started

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start with HTTPS (requires local SSL certificates)
npm run dev:https
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will redirect to the appropriate locale automatically.

### All Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with Turbopack |
| `npm run dev:https` | Dev server with HTTPS |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routes (en, ru, fr)
│   └── api/               # Internal API routes (CRUD via FormData)
├── components/
│   ├── modals/            # RecordModal, DeleteModal, SettingsModal, TrackerModal
│   ├── formComponents/    # FormAmountBlock, FormTagsBlock, FormSelectBlock, ...
│   ├── accordionBlock*/   # Year / Month / Record display components
│   └── chartsBlock/       # Charts, OverviewBlock, OverviewCard, ...
├── context/               # GlobalContext, TrackerContext, FlashContext, ModalContext
├── idb/
│   ├── IDBManager.ts      # DB lifecycle and connection caching
│   ├── CRUD/              # Per-entity CRUD (records, tags, years, months, meta)
│   └── apiHelpers/        # FormData parsers and entity factories
├── lib/
│   ├── types/             # Data types and branded ID types
│   └── utils/             # Amount helpers, validators, date parsers, ...
├── locales/               # JSON translation files (en, ru, fr)
└── tests/                 # Vitest setup
```

---

## Data Model

```
Tracker
├── meta        (id, title, createdAt, updatedAt, backupAt)
├── tags        (Record<TagId, string>)
├── totalAmount
└── years
    └── Year
        ├── totalAmount
        └── months
            └── Month
                ├── totalAmount
                └── records
                    └── MonthRecord
                        (id, year, month, day, type, tags, description, amount)
```

Amounts are stored as integers (cents) to avoid floating-point issues — `10.50` is stored as `1050`.

IDs use a branded type pattern (`Brand<T, B>`) with unique symbols: `TrackerId`, `TagId`, `YearId`, `MonthId`, `RecordId`.

---

## Testing

198 tests across 25 files covering utilities, locales, React contexts, form components, and the full IndexedDB CRUD layer.

```bash
npm run test
```

IndexedDB is mocked with `fake-indexeddb`. Interactions are simulated with `@testing-library/user-event`.
