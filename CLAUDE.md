# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multi-demo educational exhibit** for DiscoverSTEM 2025 showcasing AI-assisted development capabilities. The application includes three interactive 3D visualizations built with React and Three.js:

1. **3D Globe Visualization** - Interactive Earth globe displaying three real-world datasets:
   - Mountains (14 highest peaks)
   - Earthquakes (USGS real-time data, last 30 days)
   - Wildfires (NASA FIRMS data, last 24 hours)

2. **Molecule Viewer** - 3D molecular structure visualization with four molecules:
   - Water (H2O), Carbon Dioxide (CO2), DNA double helix, Hemoglobin protein

3. **Auto-Cycle Mode** - Automatic presentation mode with overlay controls:
   - Navigates through actual routes preserving all UI elements
   - URL-based navigation using search parameters
   - Configurable duration (5-30 seconds per view)
   - Full playback controls and keyboard shortcuts

**Purpose**: Demonstrate how AI can accelerate sophisticated 3D application development from weeks to hours, targeting high school students at STEM events.

**Tech Stack**: React 19 + TypeScript + Vite + Three.js + Globe.gl + Mantine UI + TanStack Router + Tabler Icons

## Development Commands

### Primary Workflow

- `pnpm validate` - **Main pre-commit command**: format, lint, test, and build everything
- `pnpm dev` - Start development server (http://localhost:3000, auto-opens browser)
- `pnpm build` - Production build to `dist/`
- `pnpm preview` - Preview production build locally

### Code Quality

- `pnpm format` - Format code with Prettier (write mode)
- `pnpm format:check` - Check formatting without writing
- `pnpm lint` - Fix ESLint issues (write mode)
- `pnpm lint:check` - Check ESLint without fixing

### Testing

- `pnpm test` - Run tests once with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:ui` - Launch Vitest UI for interactive testing

### Type Checking

- `pnpm ts-types` - Check TypeScript types with tsc

## Architecture

### Application Structure

**Multi-Route Application** using TanStack Router (file-based routing):

- `/` (index.tsx) - 3D Globe visualization demo with URL search param support (`?dataset=mountains|earthquakes|wildfires`)
- `/molecules` - Molecule viewer demo with URL search param support (`?molecule=water|glucose|dna|hemoglobin`)
- `__root.tsx` - Root layout with AppShell, tab navigation, AutoCycleProvider context, and AutoCycleOverlay

**Key Components**:

- Globe visualization (`src/components/Globe.tsx`) - Wrapper for GlobeRenderer
- GlobeRenderer (`src/globe/GlobeRenderer.ts`) - Core Globe.gl integration class
- MoleculeViewer (`src/components/MoleculeViewer.tsx`) - React Three Fiber 3D molecules
- AutoCycleToggle (`src/components/AutoCycleToggle.tsx`) - Header toggle button for auto-cycle mode
- AutoCycleOverlay (`src/components/AutoCycleOverlay.tsx`) - Overlay with navigation logic and keyboard shortcuts
- AutoCycleControls (`src/components/AutoCycleControls.tsx`) - Playback controls for auto-cycle
- ControlsPanel, InfoPanel - Reusable UI controls for globe demo
- MoleculeSelector, MoleculeInfo, AtomLegend - Molecule demo UI
- ErrorBoundary (`src/components/ErrorBoundary.tsx`) - App-level error handling

**Contexts**:

- AutoCycleContext (`src/contexts/AutoCycleContext.tsx`) - Global auto-cycle toggle state

**Custom Hooks**:

- useAutoCycle (`src/hooks/useAutoCycle.ts`) - Auto-cycle timer management with phase change callbacks

### Data Layer Architecture

**Pattern**: Fetch → Convert → Stats
Each dataset module (`src/data/*.ts`) exports three functions:

1. `fetch*Data()` - Fetches/loads raw data (API or static)
2. `convert*ToPoints()` - Transforms to `GlobePoint[]` for rendering
3. `get*Stats()` - Computes statistics for InfoPanel

**Available Datasets** (Globe visualization):

- `mountains.ts` - Static data (14 highest peaks over 1000m)
- `earthquakes.ts` - USGS API (real-time, last 30 days, no API key)
- `wildfires.ts` - NASA FIRMS API (requires API key, last 24 hours)

**Molecule Structures** (Molecule viewer):

- `molecules.ts` - Static molecular structures (H2O, CO2, DNA helix, Hemoglobin)

**Type Definitions** (`src/data/types.ts`):

- `GlobePoint` - Standardized format for globe visualization
- `EarthquakeData`, `EarthquakeFeature` - USGS GeoJSON types
- `Molecule`, `Atom`, `Bond` - Molecular structure types

### Build System

**Vite Configuration** (`vite.config.ts`):

- TanStack Router plugin with auto-generated route tree (`routeTree.gen.ts`)
- React Babel plugin with experimental React Compiler
- Path alias: `@` → `./src`
- Dev server: Port 3000, auto-opens browser
- Manual code splitting: three, globe, react, mantine chunks
- Build output: `dist/` with sourcemaps

**Testing Framework** (`vitest.config.ts`):

- Vitest with happy-dom environment
- Coverage: v8 provider (text/json/html reports)
- Globals enabled for test syntax

### UI Framework

**Mantine v8** with dark theme (`src/main.tsx:33`):

- Primary color: cyan
- Default radius: md
- AppShell layout for header + tab navigation
- Component library: LoadingOverlay, Stack, Group, Tabs, Title, etc.

**Three.js Integration**:

- Globe demo: Imperative Globe.gl library in `GlobeRenderer` class
- Molecule demo: Declarative React Three Fiber with `@react-three/drei`

### Routing System

**TanStack Router (Type-Safe)**:

- File-based routes in `src/routes/`
- Auto-generated route tree at build time (`routeTree.gen.ts`)
- Router devtools included (dev mode only)
- Routes registered in `main.tsx` with type safety

### Auto-Cycle Architecture

**Design Philosophy**: The auto-cycle mode navigates through actual routes instead of being a standalone route. This preserves all route-specific UI elements (InfoPanel, ControlsPanel, MoleculeSelector) while adding presentation mode capability.

**Five-Layer Architecture**:

1. **AutoCycleContext** (`src/contexts/AutoCycleContext.tsx`) - Global React context
   - State: `isEnabled: boolean`
   - Methods: `enable()`, `disable()`, `toggle()`
   - Provider wraps entire app in `__root.tsx`

2. **AutoCycleToggle** (`src/components/AutoCycleToggle.tsx`) - Header button
   - Icon toggle: Presentation icon (off) ↔ PresentationOff icon (on)
   - Calls `toggle()` from context
   - Cyan accent color when enabled

3. **AutoCycleOverlay** (`src/components/AutoCycleOverlay.tsx`) - Conditional overlay
   - Renders only when `isEnabled === true`
   - Semi-transparent backdrop with blur effect
   - Manages `useAutoCycle` hook with `onPhaseChange` callback
   - Handles keyboard shortcuts (Space, Arrows, Escape)
   - Displays AutoCycleControls panel

4. **useAutoCycle Hook** (`src/hooks/useAutoCycle.ts`) - Core timer logic
   - State management: `currentPhase` (globe|molecule), indices, duration, progress
   - Timer intervals: Main cycle timer + progress bar updater (100ms)
   - Controls: `play()`, `pause()`, `skipForward()`, `skipBackward()`, `setDuration()`
   - Callback: `onPhaseChange(phase, index)` fires when advancing/going back
   - Cycle order: 3 globe datasets (mountains→earthquakes→wildfires) → 4 molecules (water→glucose→dna→hemoglobin)

5. **URL Search Parameters** - Route state interface
   - Globe route: `/?dataset=mountains|earthquakes|wildfires`
   - Molecules route: `/molecules?molecule=water|glucose|dna|hemoglobin`
   - Routes listen for search param changes via `useEffect`
   - Auto-cycle navigates with `navigate({ to: path, search: { param: value } })`

**Navigation Flow**:

1. User clicks AutoCycleToggle → `enable()` → `isEnabled = true`
2. AutoCycleOverlay renders → starts `useAutoCycle` hook
3. Timer advances → `onPhaseChange(phase, index)` callback fires
4. Overlay calls `navigate()` with appropriate route + search params
5. Route's `useEffect` sees search param change → updates local state
6. Route renders with new dataset/molecule (all UI preserved)

**Keyboard Shortcuts** (AutoCycleOverlay.tsx:29-54):

- `Escape` - Exit auto-cycle mode (calls `disable()`)
- `Space` - Toggle play/pause
- `ArrowLeft` - Skip backward to previous visualization
- `ArrowRight` - Skip forward to next visualization

**Memory Management**:

- Timer intervals cleaned up in `useEffect` cleanup functions
- Event listeners properly removed on unmount
- Bound function references stored for correct cleanup (GlobeRenderer.ts:44)

## External Data Sources

### Mountains (No API Key)

- **Source**: Static dataset in `mountains.ts`
- **Data**: 14 highest mountain peaks with elevation and coordinates
- **Visualization**: Blue gradient, size proportional to elevation above 1000m
- **Peaks**: Everest, K2, Kangchenjunga, Lhotse, Makalu, Cho Oyu, etc.

### Earthquakes (No API Key)

- **Source**: USGS Earthquake Hazards Program
- **URL**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`
- **Format**: GeoJSON FeatureCollection
- **Coverage**: Last 30 days, worldwide, real-time updates
- **Visualization**: Color scale by magnitude (green→yellow→orange→red), exponential size

### Wildfires (API Key Required)

- **Source**: NASA FIRMS (Fire Information for Resource Management System)
- **API Key Setup**: Create `.env` with `VITE_NASA_FIRMS_API_KEY=your_key_here`
- **Registration**: https://firms.modaps.eosdis.nasa.gov/api/area/
- **Sensor**: VIIRS S-NPP (375m resolution)
- **Coverage**: Last 24 hours, worldwide
- **Fallback**: Sample data (5 demo fires) if no API key configured
- **Visualization**: Color scale by FRP (gold→orange→red), logarithmic size

### Molecules (No API Key)

- **Source**: Static dataset in `molecules.ts`
- **Data**: Atom positions, bonds, chemical properties
- **Molecules**: Water (3 atoms), CO2 (3 atoms), DNA helix (simplified), Hemoglobin (simplified)
- **Visualization**: Ball-and-stick model with CPK coloring, realistic Van der Waals radii

## Development Patterns

### Globe Visualization Flow

1. User selects dataset in ControlsPanel → triggers `handleDatasetChange`
2. `useEffect` watches dataset → calls `handleLoadData()`
3. Data module fetches raw data → converts to `GlobePoint[]` → computes stats
4. `setPoints()` updates Globe component → `GlobeRenderer.setPoints()` renders
5. InfoPanel displays stats from `get*Stats()` functions

### GlobeRenderer Lifecycle

- **Creation**: Instantiated in Globe component's `useEffect` (mount)
- **Configuration**: Globe.gl setup with Earth textures, camera, auto-rotation
- **Updates**: `setPoints()`, `setRotationSpeed()`, `enableAutoRotate()`
- **Cleanup**: `destroy()` removes event listeners and clears container

### React Three Fiber Pattern (Molecules)

- **Canvas**: Top-level R3F component wrapping 3D scene
- **Declarative Mesh**: `<mesh>` → `<sphereGeometry>` → `<meshStandardMaterial>`
- **Controls**: `<OrbitControls autoRotate={autoRotate} />`
- **Camera**: `<PerspectiveCamera position={[0, 0, 15]} />`
- **Lighting**: Ambient + directional lights for realistic rendering

## Key Implementation Details

### Globe Texture URLs (GlobeRenderer.ts:20-22)

Uses unpkg.com CDN for Three.js globe assets:

- `earth-blue-marble.jpg` - NASA Blue Marble surface texture
- `earth-topology.png` - Bump map for terrain relief
- `night-sky.png` - Background starfield

### Point Visualization (GlobeRenderer.ts:47-55)

All datasets use bar visualization with:

- `pointAltitude="size"` - Height represents magnitude/intensity
- `pointColor="color"` - Dataset-specific color scales
- `pointRadius=0.08` - Fixed radius for consistency
- `pointLabel` - Hover tooltips with data details

### Molecule Rendering (MoleculeViewer.tsx)

- **Atoms**: Spheres with element-specific colors and Van der Waals radii
- **Bonds**: Cylinders between atoms, positioned/rotated via quaternion math
- **Simplified Mode**: Larger atoms with emissive glow for educational clarity
- **Bond Orders**: Single (0.08 radius), double (2 parallel cylinders), triple (3 parallel)

### Code Splitting Strategy (vite.config.ts:25-30)

Manual chunks to optimize loading:

- `three` chunk - Three.js library (~500KB)
- `globe` chunk - Globe.gl library
- `react` chunk - React + ReactDOM
- `mantine` chunk - Mantine UI components

## Environment Variables

**NASA FIRMS API Key** (optional):

```env
VITE_NASA_FIRMS_API_KEY=your_api_key_here
```

**Vite Environment Variables**:

- Prefix: `VITE_` required for client-side access
- Access: `import.meta.env.VITE_NASA_FIRMS_API_KEY`
- Location: `.env` file in project root (gitignored)

## Performance Considerations

- **60 FPS Target**: Optimized for live exhibit display
- **Lazy Loading**: Dataset APIs fetched on-demand when selected
- **Code Splitting**: Separate chunks for Three.js, Globe.gl, React, Mantine
- **Sample Data Fallback**: Offline capability for internet failures at events
- **Resize Handling**: Globe automatically adapts to window size changes

## Documentation

- `docs/3-globe-visualization-guide.md` - Step-by-step build guide (original plan)
- `docs/README.md` - Demo project overview
- `README.md` - User-facing setup and usage guide

## Known Patterns

### Adding New Datasets

1. Create `src/data/[dataset].ts` with fetch/convert/stats functions
2. Import functions in `src/routes/index.tsx`
3. Add case to `handleLoadData()` switch statement
4. Add option to ControlsPanel dataset Select component
5. Update InfoPanel to handle dataset-specific stat labels

### Adding New Routes

1. Create `src/routes/[name].tsx` with component and `createFileRoute`
2. Add URL search param support if route should be auto-cycle compatible:
   ```typescript
   export const Route = createFileRoute("/[name]")({
     validateSearch: (search: Record<string, unknown>) => ({
       param: (search.param as string) || undefined,
     }),
     component: YourComponent,
   })
   ```
3. In component, sync URL search params with local state:
   ```typescript
   const searchParams = Route.useSearch()
   useEffect(() => {
     if (searchParams.param && searchParams.param !== localState) {
       setLocalState(searchParams.param)
     }
   }, [searchParams.param])
   ```
4. TanStack Router plugin auto-generates route in `routeTree.gen.ts`
5. Add tab to `__root.tsx` AppShell header Tabs component
6. Update `useAutoCycle` arrays if route should be included in auto-cycle
7. Router automatically handles navigation and type safety
