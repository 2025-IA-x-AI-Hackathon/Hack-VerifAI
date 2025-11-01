# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TruAI is a Next.js 14 application built with TypeScript, Tailwind CSS, and shadcn/ui component library. The project uses the App Router architecture and follows modern React Server Components patterns.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Framework Configuration

- **Next.js 14.2.33**: Uses App Router (not Pages Router)
- **TypeScript**: Strict mode enabled with modern ESNext compilation
- **Tailwind CSS**: Custom design system with CSS variables for theming
- **shadcn/ui**: Component library with customizable UI components

### Project Structure

```
src/
├── app/              # Next.js App Router directory
│   ├── layout.tsx    # Root layout with font configuration
│   ├── page.tsx      # Home page
│   ├── globals.css   # Global styles and Tailwind directives
│   └── fonts/        # Local font files (Geist Sans & Mono)
├── components/       # React components
│   └── ui/           # shadcn/ui components
└── lib/              # Utility functions
    └── utils.ts      # cn() helper for className merging
```

### Path Aliases

TypeScript is configured with the following path alias:
- `@/*` → `./src/*`

Example: `import { Button } from "@/components/ui/button"`

### Design System

The project uses a CSS variable-based theming system defined in `src/app/globals.css`. All colors reference HSL values through CSS custom properties:

- Semantic color tokens (primary, secondary, accent, destructive, etc.)
- Dark mode support via class-based theming (`darkMode: ["class"]`)
- Consistent border radius system using `--radius` variable

### shadcn/ui Configuration

Components are installed via `npx shadcn@latest add [component]` and stored in `src/components/ui/`.

Configuration (components.json):
- Style: default
- Base color: slate
- CSS variables: enabled
- RSC: enabled (React Server Components)

When adding new shadcn/ui components, they will automatically use the configured aliases and styling.

### Fonts

The app uses Geist font family (Sans and Mono) loaded as local fonts via `next/font/local`. Font variables are applied globally in the root layout:
- `--font-geist-sans`
- `--font-geist-mono`

## Key Dependencies

- **UI Components**: @radix-ui/react-slot, lucide-react
- **Styling**: class-variance-authority, clsx, tailwind-merge
- **Type Safety**: Full TypeScript coverage with strict mode

## Development Notes

- This is a Server Component-first architecture; use 'use client' directive only when necessary
- The `cn()` utility function in `@/lib/utils` should be used for conditional className merging
- All UI components follow the shadcn/ui pattern with variant-based styling using class-variance-authority
