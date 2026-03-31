# swapi-api-pw-typescript

## 🚀 SWAPI API Testing Framework

A **Playwright + TypeScript** framework for API testing against the [Star Wars API (SWAPI)](https://swapi.dev/). Built as a TypeScript port of [swapi-api](https://github.com/igor-d-stevanovic/swapi-api) (Python/pytest) — demonstrating best practices in API test automation with TypeScript.

## 📁 Project Structure

```
swapi-api-pw-typescript/
├── src/
│   ├── config/
│   │   └── settings.ts          # Configuration — base URL, timeouts, retries
│   ├── models/
│   │   ├── base.ts              # Generic PaginatedResponse<T> model (Zod)
│   │   ├── people.ts            # Person schema & type
│   │   ├── planets.ts           # Planet schema & type
│   │   ├── films.ts             # Film schema & type
│   │   ├── species.ts           # Species schema & type
│   │   ├── vehicles.ts          # Vehicle schema & type
│   │   └── starships.ts         # Starship schema & type
│   ├── clients/
│   │   ├── base-client.ts       # Low-level HTTP wrapper (Playwright APIRequestContext)
│   │   └── swapi-client.ts      # High-level typed SWAPI client
│   └── utils/
│       └── assertions.ts        # Reusable assertion helpers
├── tests/
│   ├── fixtures.ts              # Shared Playwright Test fixtures (swapiClient)
│   ├── root.spec.ts
│   ├── people.spec.ts
│   ├── planets.spec.ts
│   ├── films.spec.ts
│   ├── species.spec.ts
│   ├── vehicles.spec.ts
│   ├── starships.spec.ts
│   ├── parametrized.spec.ts     # Cross-resource parametrized tests
│   └── negative.spec.ts         # Negative / edge-case tests
├── .github/workflows/
│   └── tests.yml                # GitHub Actions CI (Allure → GitHub Pages)
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| **Playwright** | HTTP client via `APIRequestContext` (no browser needed) |
| **@playwright/test** | Test runner & fixtures |
| **TypeScript** | Static typing throughout |
| **Zod** | Runtime response schema validation (equivalent to Pydantic) |
| **Allure** | Rich HTML test reporting |
| **GitHub Actions** | CI pipeline with Allure report publishing |

## ⚡ Prerequisites

- **Node.js 18+**
- **npm** (or your preferred package manager)

## 🛠️ Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd swapi-api-pw-typescript

# 2. Install dependencies
npm install

# 3. Install Playwright (API tests don't need browsers, but this sets up the runner)
npx playwright install --with-deps chromium
```

## 🏃 Running Tests

```bash
# Run ALL tests (parallel by default – 75% of CPU cores)
npm test

# Run tests serially
npm run test:serial

# Run specific resource tests
npx playwright test tests/people.spec.ts
npx playwright test tests/starships.spec.ts

# TypeScript type check
npm run typecheck
```

## ⚙️ Configuration

Settings are controlled via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SWAPI_BASE_URL` | `https://swapi.dev` | API base URL |
| `SWAPI_TIMEOUT` | `30000` | Request timeout (ms) |
| `SWAPI_MAX_RESPONSE_TIME_MS` | `5000` | Response time SLA (ms) |
| `SWAPI_RETRIES` | `2` | Retry count for transient failures |
| `SWAPI_RETRY_DELAY_MS` | `500` | Base delay between retries (ms) |

## 📊 Allure Reports

The CI pipeline automatically generates and publishes Allure HTML reports to GitHub Pages on every push to `main`.
