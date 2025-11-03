# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **3D Interactive Globe Data Visualization** project for an ACTON STEM educational exhibit. It demonstrates how AI can help build sophisticated 3D applications that would normally require weeks of development and specialized graphics expertise.

**Purpose**: Create an interactive 3D Earth globe visualizing real global datasets (earthquakes, flights, climate data, wildfires) to showcase AI-assisted development capabilities to high school students.

**Build Target**: 3-4 hours with AI assistance vs. 1-2 weeks normally

**Tech Stack**: Three.js + Globe.gl library + public data APIs (USGS, NASA, OpenSky Network)

**Project Status**: Currently a TypeScript library template - needs to be adapted for the globe visualization application.

## Documentation

**Primary Guide**: `docs/3-globe-visualization-guide.md` - Complete step-by-step build instructions
**Demo Context**: `docs/README.md` - Overview of the three demo projects (this is Demo #3)

## Development Commands

### Pre-Checkin Command

- `pnpm validate` - **Main command**: Format, lint, test, and build everything for checkin

### Formatting

- `pnpm format` - Format code with Prettier (write mode)
- `pnpm format:check` - Check Prettier formatting without writing

### Linting

- `pnpm lint` - Fix ESLint issues (write mode)
- `pnpm lint:check` - Check ESLint issues without fixing

### Testing

- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Launch Vitest UI for interactive testing

### Building

- `pnpm build` - Production build (outputs to `dist/`)
- `pnpm build:watch` - Watch mode build
- `pnpm dev` - Development build with watch mode (alias for build:watch)

### Type Checking

- `pnpm ts-types` - Check TypeScript types with tsc

## Architecture (Current Template State)

### Build System

- **tsup**: Primary build tool configured in `tsup.config.ts`
- **Dual Output Directories**:
  - `lib/` - Development builds (NODE_ENV !== "production")
  - `dist/` - Production builds (NODE_ENV === "production")
- **Format Support**: Generates both CommonJS (`.js`) and ES modules (`.mjs`)
- **Environment-Based Behavior** (tsup.config.ts:3):
  - Production: minified, bundled, no watch
  - Development: source maps, watch mode, faster builds

### Testing Framework

- **Vitest**: Modern test runner with hot reload and coverage
- **Configuration**: `vitest.config.ts` with Node.js environment
- **Coverage**: Uses v8 provider with text/json/html reports

### Code Quality Tools

- **ESLint**: Flat config setup in `eslint.config.mjs` with TypeScript support
- **Prettier**: Integrated with ESLint for consistent formatting
- **Import Sorting**: Automatic import organization via `simple-import-sort`

### TypeScript Configuration

- **Strict Mode**: Enabled with pragmatic exceptions:
  - `noImplicitAny: false` - Allows implicit any for flexibility
  - `strictPropertyInitialization: false` - Relaxed for constructor properties
- **Target**: ESNext for modern JavaScript features
- **Output**: TypeScript only emits declaration files; tsup handles transpilation

## Implementation Plan (Per docs/3-globe-visualization-guide.md)

### Seven-Step Build Process

1. **Basic 3D Globe Setup** (30 min) - Three.js globe with rotation and controls
2. **Add Earthquake Data** (45 min) - USGS API integration with magnitude-based visualization
3. **Multiple Dataset Support** (60 min) - Flights, COVID, wildfires, meteors, cities
4. **Time-Based Playback** (45 min) - Timeline controls and animation
5. **Info Panels & Statistics** (30 min) - Data details and analytics
6. **Custom Data Upload** (30 min) - CSV/GeoJSON file support
7. **Polish & Advanced Features** (45 min) - Performance, accessibility, exports

**Total Build Time**: ~4 hours

### Key Data Sources

**Free APIs (No Key)**:
- USGS Earthquakes: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`
- COVID-19: `https://disease.sh/v3/covid-19/countries`

**Free APIs (Key Required)**:
- OpenSky Network: Flight data (400 credits/day free tier)
- NASA FIRMS: Wildfire data (free API key)

**Static Datasets**: World cities, historical events, UNESCO sites (CSV format)

## Project Adaptation Requirements

This repository currently contains the TypeScript library template structure. To build the globe visualization:

1. **Decide on architecture**: Standalone web app vs. reusable library component
2. **Add dependencies**: Three.js, Globe.gl, data processing libraries
3. **Update build configuration**: May need HTML/CSS bundling for web app
4. **Create visualization modules**: Globe renderer, data fetchers, UI components
5. **Add example datasets**: Sample CSV files for demo purposes
6. **Configure deployment**: GitHub Pages or similar static hosting

## Deployment Strategy

**Recommended**: GitHub Pages for simple static hosting
- Fast CDN delivery
- Easy updates via git push
- Custom domain support
- No server-side logic needed (all APIs are client-side)

**Alternative**: Vercel/Netlify for serverless functions if needed for API key security

## Key Constraints

- **Build in hours, not weeks**: Leverage AI to handle complex 3D graphics code
- **Educational focus**: Code should be understandable to high school students
- **Demo-ready**: Must run smoothly at live exhibit (60fps target)
- **Offline fallback**: Hardcoded sample data in case of internet failure at event
- **Professional quality**: Comparable to news organization data visualizations
