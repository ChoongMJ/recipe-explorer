# Recipe Explorer Lite

A lightweight recipe browsing application built with Next.js 15, TypeScript, Tailwind CSS, and React Query.

## Features

- Browse a list of recipes from TheMealDB API
- View detailed recipe information including ingredients and instructions
- Submit feedback on recipes
- Responsive design for all device sizes

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS for styling
- TanStack Query (React Query) for data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/recipe-explorer.git
cd recipe-explorer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Main application code (Next.js App Router)
  - `components`: Reusable UI components
  - `services`: API services and utilities
  - `recipe/[id]`: Recipe detail page route
- `public`: Static assets

## Data Fetching Approach

This application uses React Query to fetch and manage data from TheMealDB API. The main benefits of this approach:

- Automatic caching and refetching
- Loading and error states management
- Server-side and client-side data fetching support
- Optimistic updates for mutations

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/your-username/recipe-explorer)

## License

MIT
