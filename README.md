# Recipe Explorer Lite

A lightweight recipe browser built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and TanStack Query. The app lets users search meals from TheMealDB, filter by category, inspect full recipe details, and submit UI-only feedback through a mock form flow.

## Highlights

- Browse recipes from TheMealDB API
- Search recipes by name with a debounced input
- Filter recipes by category
- View recipe details, ingredients, instructions, and YouTube tutorial links
- Use responsive navigation with a mobile sheet menu
- Toggle between light and dark themes
- See loading skeletons and friendly error states across the main flows
- Submit feedback through a mocked client-side form experience

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query v5
- shadcn/ui primitives and Lucide icons

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

```bash
git clone https://github.com/ChoongMJ/recipe-explorer-nextjs.git
cd recipe-explorer-nextjs
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
```

## Routes

- `/` shows the searchable, filterable recipe list
- `/recipe/[id]` shows a single recipe detail view
- `/feedback` shows the feedback form

## Project Structure

```text
src/
  app/
    components/      App-specific UI like RecipeList, RecipeDetail, Navbar
    feedback/        Feedback page route
    recipe/[id]/     Dynamic recipe detail route
    services/        API helpers for TheMealDB and feedback submission
    providers.tsx    React Query provider
  components/ui/     Shared shadcn/ui primitives
  lib/               Shared utilities
public/              Static assets
```

## Data and State

- Recipe data comes from [TheMealDB](https://www.themealdb.com/)
- TanStack Query handles client-side fetching, caching, loading states, and error states
- Recipe search uses a debounced input to avoid firing a request on every keystroke
- Category filtering is fetched separately, then combined with search results in the UI

## Configuration

No environment variables are required right now.

The app calls TheMealDB directly from the client and allows remote images from `www.themealdb.com` through the Next.js image configuration.

## Current Scope and Limitations

- The feedback form is mocked and does not persist data to a backend
- The app currently depends on TheMealDB being available
- Production builds need internet access to fetch the Google-hosted Geist fonts used by `next/font`

## Troubleshooting

- If images do not load, confirm that external image loading from TheMealDB is still allowed in `next.config.ts`
- If `npm run build` fails in an offline or restricted environment, the font download step is the likely cause
- The existing `npm run lint` script is not documented here because it currently needs updating for this project setup

## Deployment

This project can be deployed on Vercel or any platform that supports Next.js 16.

Repository:
<https://github.com/ChoongMJ/recipe-explorer-nextjs>

## License

This repository does not currently include a license file. Add one before publishing or reusing the project under a specific license.
