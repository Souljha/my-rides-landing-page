# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based landing page for QuickRide, an e-hailing taxi service. The project is built with:
- **React 19** with TypeScript
- **Vite** as the build tool and dev server
- **Tailwind CSS** for styling (using custom CSS classes)
- **Google Gemini API** integration for enhanced functionality

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture and Structure

### Component Architecture
- **App.tsx**: Main application component that renders the page layout
- **components/**: Contains all React components
  - `Header.tsx`: Navigation header
  - `Hero.tsx`: Main hero section with background image and CTAs
  - `Features.tsx`: Service features section with icon cards
  - `ContactForm.tsx`: Contact form component
  - `Footer.tsx`: Site footer
  - `icons/`: Custom SVG icon components (ClockIcon, ShieldIcon, TagIcon)

### Key Features
- Responsive design optimized for mobile and desktop
- Full-screen hero section with background image overlay
- Feature cards with hover animations
- Contact form for user inquiries
- Custom SVG icons for features

### Environment Configuration
- Requires `GEMINI_API_KEY` in `.env.local` for API functionality
- Vite config exposes the API key as `process.env.GEMINI_API_KEY` and `process.env.API_KEY`
- Path alias `@/*` maps to the root directory

### Styling Approach
- Uses Tailwind CSS utility classes throughout
- Custom CSS classes for branding (primary, secondary, primary-dark colors)
- Responsive design with mobile-first approach
- Hover effects and transitions for interactive elements

## TypeScript Configuration
- Target: ES2022 with React JSX transform
- Module resolution: bundler mode with isolated modules
- Experimental decorators enabled
- No emit mode (handled by Vite)
- Path mapping configured for `@/*` imports

## Development Notes
- The project uses React 19 features with strict mode enabled
- All components are functional components with TypeScript interfaces
- The Hero component uses an external Unsplash image for the background
- Feature data is defined as a static array within the Features component