# GEMINI.md

## Project Overview
This project is a modern web application built using **Next.js 16** (App Router) and **React 19**. It is structured with a monorepo-like layout where the main application resides in the `my-profile` directory.

### Key Technologies
- **Framework:** Next.js 16.2.2 (App Router)
- **Library:** React 19.2.4
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript 5.0
- **Linting:** ESLint 9.0

## Directory Structure
- `my-profile/`: The core Next.js application.
  - `app/`: Contains the application routes and layouts (App Router).
  - `public/`: Static assets.
  - `next.config.ts`: Next.js configuration.
  - `package.json`: Project dependencies and scripts.
- `AGENTS.md` / `CLAUDE.md`: Specialized instructions for AI agents, noting that this version of Next.js may have breaking changes compared to standard versions.

## Building and Running
All commands should be executed within the `my-profile` directory.

### Development
To start the development server:
```bash
cd my-profile
npm run dev
```

### Build
To create a production build:
```bash
cd my-profile
npm run build
```

### Production Start
To start the application in production mode:
```bash
cd my-profile
npm run start
```

### Linting
To run ESLint:
```bash
cd my-profile
npm run lint
```

## Development Conventions
- **App Router:** Follow Next.js App Router conventions (e.g., `layout.tsx`, `page.tsx`).
- **TypeScript:** Strict typing is encouraged.
- **Tailwind CSS:** Use Tailwind CSS 4 utility classes for styling.
- **AI Agent Note:** This project uses a specific version of Next.js with potential breaking changes. Refer to `node_modules/next/dist/docs/` for specific API guidance as noted in `AGENTS.md`.
- **Formatting:** Adhere to the existing project style, which utilizes Geist fonts and zinc-based color palettes.
