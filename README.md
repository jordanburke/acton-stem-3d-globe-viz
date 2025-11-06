# 3D Interactive Visualizations - DiscoverSTEM 2025

A multi-demo educational exhibit featuring two interactive 3D visualizations: an Earth globe displaying real-world datasets (mountains, earthquakes, wildfires) and a molecular structure viewer. Built for DiscoverSTEM 2025 to showcase AI-assisted development capabilities.

## Features

### 3D Globe Visualization

- **Interactive 3D Globe**: Rotate and zoom with mouse/touch controls
- **Multiple Datasets**:
  - **Mountains**: 14 highest peaks over 1000m with elevation visualization
  - **Earthquakes**: Real-time USGS data for the last 30 days with magnitude-based visualization
  - **Wildfires**: NASA FIRMS satellite fire data with Fire Radiative Power (FRP) metrics
- **Dynamic Statistics**: Live stats panel showing dataset metrics
- **Responsive Controls**: Dataset selection and rotation speed adjustment

### 3D Molecule Viewer

- **Interactive Molecular Structures**: View water, CO2, DNA, and protein molecules in 3D
- **Realistic Rendering**: Atoms with accurate colors and Van der Waals radii
- **Bond Visualization**: Single, double, and triple bonds with proper geometry
- **Auto-Rotation**: Toggle automatic rotation for better viewing
- **Atom Legend**: Color-coded guide for chemical elements

### Auto-Cycle Mode (NEW!)

- **Automatic Presentation**: Cycles through all 7 visualizations automatically
- **Header Toggle**: Enable/disable via toggle button in the header (no separate route)
- **Preserves Route UI**: Navigates through actual routes, keeping InfoPanel, ControlsPanel, and MoleculeSelector
- **URL-Based Navigation**: Uses search params (`/?dataset=mountains`, `/molecules?molecule=water`)
- **Configurable Duration**: 5-30 seconds per view (default: 10s)
- **Playback Controls**: Play, pause, skip forward/backward
- **Progress Indicator**: Visual progress bar showing time remaining
- **Keyboard Shortcuts**:
  - Space: Play/pause
  - Arrow Left/Right: Skip backward/forward
  - Escape: Exit auto-cycle mode
- **Overlay Display**: Semi-transparent overlay with controls during presentation
- **Cycle Order**: Mountains → Earthquakes → Wildfires → Water → Glucose → DNA → Hemoglobin

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Development Commands

### Main Commands

- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm preview` - Preview production build

### Code Quality

- `pnpm validate` - **Pre-commit check**: format, lint, test, and build
- `pnpm format` - Format code with Prettier
- `pnpm lint` - Fix ESLint issues
- `pnpm test` - Run tests with Vitest
- `pnpm test:coverage` - Run tests with coverage report

## NASA FIRMS Wildfire Data Setup

The wildfire dataset requires a free NASA FIRMS API key.

### Getting Your API Key

1. Visit: https://firms.modaps.eosdis.nasa.gov/api/area/
2. Sign up for a free account
3. Request an API key (instant approval)

### Configuring the API Key

#### Option 1: Environment Variable (Recommended)

Create a `.env` file in the project root:

```env
VITE_NASA_FIRMS_API_KEY=your_api_key_here
```

#### Option 2: Direct Configuration

Edit `src/data/wildfires.ts` and replace the environment variable:

```typescript
const NASA_FIRMS_API_KEY = "your_api_key_here"
```

### Without API Key

The app will automatically use sample wildfire data (5 demo fires) if no API key is configured.

## Tech Stack

- **React 19** - UI framework with React Compiler
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe file-based routing
- **Mantine UI v8** - Component library with dark theme
- **Tabler Icons** - Icon library for UI controls
- **Three.js** - 3D graphics engine
- **Globe.gl** - 3D globe visualization (imperative API)
- **React Three Fiber** - Declarative Three.js for molecule viewer

## Data Sources

### Mountains (No API Key Required)

- **Source**: Static dataset of 14 highest peaks
- **Data**: Peak name, elevation, coordinates
- **Visualization**: Height proportional to elevation above 1000m

### Earthquakes (No API Key Required)

- **Source**: USGS Earthquake Hazards Program
- **API**: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
- **Coverage**: Last 30 days, worldwide
- **Update Frequency**: Real-time (updates every minute)
- **Visualization**: Color and size based on magnitude

### Wildfires (API Key Required)

- **Source**: NASA FIRMS (Fire Information for Resource Management System)
- **Sensor**: VIIRS S-NPP (375m resolution)
- **Coverage**: Last 24 hours, worldwide
- **Update Frequency**: Near real-time (every 3-5 hours)
- **Visualization**: Color and size based on Fire Radiative Power (FRP)

### Molecules (No API Key Required)

- **Source**: Static molecular structure data
- **Molecules**: Water (H2O), Carbon Dioxide (CO2), DNA helix, Hemoglobin protein
- **Data**: Atom positions, bonds, chemical properties
- **Visualization**: Ball-and-stick model with realistic colors

## Project Structure

```
src/
├── routes/                  # TanStack Router file-based routes
│   ├── __root.tsx          # Root layout with AppShell, tabs, and auto-cycle context
│   ├── index.tsx           # Globe visualization (home route with URL search params)
│   └── molecules.tsx       # Molecule viewer route (with URL search params)
├── components/              # React components
│   ├── Globe.tsx           # Globe wrapper component
│   ├── ControlsPanel.tsx   # Dataset and rotation controls
│   ├── InfoPanel.tsx       # Statistics display
│   ├── MoleculeViewer.tsx  # React Three Fiber molecule renderer
│   ├── MoleculeSelector.tsx # Molecule selection UI
│   ├── MoleculeInfo.tsx    # Molecule details panel
│   ├── AtomLegend.tsx      # Chemical element legend
│   ├── AutoCycleToggle.tsx # Header toggle button for auto-cycle mode
│   ├── AutoCycleOverlay.tsx # Auto-cycle overlay with navigation logic
│   └── AutoCycleControls.tsx # Auto-cycle playback controls
├── contexts/                # React contexts
│   └── AutoCycleContext.tsx # Shared auto-cycle toggle state
├── hooks/                   # Custom React hooks
│   └── useAutoCycle.ts     # Auto-cycle timer and state management
├── data/                    # Data fetching and processing
│   ├── earthquakes.ts      # USGS earthquake data
│   ├── wildfires.ts        # NASA FIRMS wildfire data
│   ├── mountains.ts        # Static mountain peaks data
│   ├── cities.ts           # Static world cities data
│   ├── molecules.ts        # Molecular structure definitions
│   └── types.ts            # Shared TypeScript types
├── globe/                   # Globe rendering logic
│   └── GlobeRenderer.ts    # Globe.gl setup and management
├── main.tsx                 # Application entry point
└── routeTree.gen.ts        # Auto-generated route tree
```

## Visualization Details

### Mountains

- **Color**: Blue gradient based on elevation
- **Size**: Proportional to elevation above 1000m
- **Data Points**: 14 highest peaks (Everest, K2, Kangchenjunga, etc.)
- **Tooltips**: Peak name, elevation, coordinates

### Earthquakes

- **Color Scale**: Green (micro) → Yellow (minor) → Orange (moderate) → Red (major)
- **Size**: Exponentially scaled by magnitude (M^1.5)
- **Data Points**: 7,000+ earthquakes from last 30 days
- **Tooltips**: Magnitude, depth, location, time, tsunami warnings

### Wildfires

- **Color Scale**: Gold (low FRP) → Orange → Red (extreme FRP)
- **Size**: Logarithmically scaled by Fire Radiative Power
- **Data Points**: Active fires detected in last 24 hours
- **Tooltips**: FRP, brightness, confidence, satellite, day/night detection

### Molecules

- **Rendering**: Ball-and-stick model with realistic atom sizes
- **Colors**: CPK coloring (H=white, C=gray, N=blue, O=red, etc.)
- **Bonds**: Cylinders connecting atoms (single/double/triple bonds)
- **Molecules**: Water, CO2, DNA double helix, Hemoglobin protein

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Architecture Notes

### Auto-Cycle Implementation

The auto-cycle feature uses a layered architecture:

1. **AutoCycleContext**: Global React context providing `isEnabled`, `enable()`, `disable()`, and `toggle()` methods
2. **AutoCycleToggle**: Header button component that toggles the context state
3. **AutoCycleOverlay**: Conditionally rendered overlay that:
   - Wraps the entire app when auto-cycle is enabled
   - Manages the `useAutoCycle` hook with navigation callback
   - Handles keyboard shortcuts (Space, Arrows, Escape)
   - Displays the AutoCycleControls panel
4. **useAutoCycle Hook**: Core logic managing:
   - Timer intervals for automatic advancement
   - Progress tracking (0-100%)
   - Phase/index state (globe datasets 0-2, molecules 0-3)
   - Callback system for navigation events
5. **URL Search Params**: Routes accept search parameters for external control:
   - Globe route: `/?dataset=mountains|earthquakes|wildfires`
   - Molecules route: `/molecules?molecule=water|glucose|dna|hemoglobin`

This approach preserves all existing route UI (InfoPanel, ControlsPanel, MoleculeSelector) while adding presentation mode capability.

## Performance Notes

- **60 FPS Target**: Optimized for live exhibit display
- **Code Splitting**: Separate chunks for Three.js, Globe.gl, React, Mantine
- **Lazy Loading**: Dataset APIs fetched on-demand when selected
- **Sample Data Fallback**: Offline capability for internet failures at events
- **Memory Management**: Proper cleanup of event listeners and intervals

## Troubleshooting

### Globe not visible

- Check browser console for CORS errors
- Ensure HTTPS URLs are used for globe textures
- Verify WebGL is enabled in browser

### Wildfires showing sample data only

- Verify API key is configured correctly
- Check `.env` file exists with `VITE_NASA_FIRMS_API_KEY`
- Restart dev server after adding environment variables

### Data not loading

- Check internet connection
- Verify API endpoints are accessible
- Look for CORS errors in browser console
- Check if API services are operational

## License

MIT

## Educational Use

This project was built to demonstrate AI-assisted development capabilities at the ACTON STEM exhibit, showing how modern AI tools can accelerate complex 3D application development from weeks to hours.
