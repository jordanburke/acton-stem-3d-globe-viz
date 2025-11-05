/**
 * Script to fetch and compile all mountain peaks from Open Peaks repository
 * Source: https://github.com/open-peaks/data
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface GeoJSONFeature {
  type: string
  geometry: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  properties: {
    name: string
    meters?: number
    feet?: number
    continent?: string
    countries?: string[]
    regions?: string[]
    country?: string
  }
}

interface GeoJSONCollection {
  type: string
  features: GeoJSONFeature[]
}

interface MountainData {
  name: string
  country: string
  elevation: number // in meters
  latitude: number
  longitude: number
}

async function fetchGeoJSON(url: string): Promise<GeoJSONCollection> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return await response.json()
}

async function fetchAllPeaks(): Promise<MountainData[]> {
  console.log("Fetching Open Peaks index...")
  const indexUrl = "https://raw.githubusercontent.com/open-peaks/data/master/_index.geojson"

  const data = await fetchGeoJSON(indexUrl)
  console.log(`Found ${data.features.length} peaks in index`)

  const mountains: MountainData[] = []

  for (const feature of data.features) {
    const props = feature.properties
    const coords = feature.geometry.coordinates

    // Extract elevation - prefer meters, fall back to feet conversion
    let elevationMeters: number | undefined

    if (props.meters) {
      elevationMeters = props.meters
    } else if (props.feet) {
      elevationMeters = Math.round(props.feet * 0.3048)
    }

    if (!elevationMeters || !props.name) {
      console.warn(`Skipping peak with missing elevation: ${props.name || "unknown"}`)
      continue
    }

    // Filter out peaks below 600m
    if (elevationMeters < 600) {
      continue
    }

    // Extract country information
    let country = "Unknown"
    if (props.countries && props.countries.length > 0) {
      country = props.countries.join(", ")
    } else if (props.country) {
      country = props.country
    } else if (props.regions && props.regions.length > 0) {
      country = props.regions[0]
    }

    mountains.push({
      name: props.name,
      country,
      elevation: elevationMeters,
      latitude: coords[1], // GeoJSON is [lng, lat]
      longitude: coords[0],
    })
  }

  console.log(`Successfully processed ${mountains.length} peaks`)

  // Sort by elevation (highest first)
  mountains.sort((a, b) => b.elevation - a.elevation)

  return mountains
}

async function main() {
  try {
    const peaks = await fetchAllPeaks()

    // Generate TypeScript code
    const output = `import type { GlobePoint } from "./types"

// World mountains from Open Peaks dataset (${peaks.length} peaks, elevation >= 600m)
// Data source: https://github.com/open-peaks/data
// Fetched: ${new Date().toISOString()}
// Elevation range: ${peaks[peaks.length - 1].elevation}m - ${peaks[0].elevation}m

interface MountainData {
  name: string
  country: string
  elevation: number // in meters
  latitude: number
  longitude: number
}

const MOUNTAINS_DATA: MountainData[] = ${JSON.stringify(peaks, null, 2)}

/**
 * Gets color based on mountain elevation
 * Heat map gradient: light blue (low) → blue → green → yellow → orange → red (8000m+)
 */
function getElevationColor(elevation: number): string {
  if (elevation >= 8000) return "#d32f2f" // Red - 8000m+ (14 peaks)
  if (elevation >= 7000) return "#ff6f00" // Dark orange - 7000-8000m
  if (elevation >= 6000) return "#ffa726" // Orange - 6000-7000m
  if (elevation >= 5000) return "#ffeb3b" // Yellow - 5000-6000m
  if (elevation >= 3000) return "#aed581" // Light green - 3000-5000m
  if (elevation >= 2000) return "#66bb6a" // Green - 2000-3000m
  if (elevation >= 1000) return "#42a5f5" // Blue - 1000-2000m
  return "#81d4fa" // Light blue - below 1000m
}

/**
 * Gets size (altitude) based on mountain elevation
 * Linear scaling normalized to globe units
 */
function getElevationSize(elevation: number): number {
  // Scale elevation to reasonable globe altitude
  const minElevation = ${peaks[peaks.length - 1].elevation}
  const maxElevation = ${peaks[0].elevation}
  const minSize = 0.02
  const maxSize = 0.15

  const normalized = (elevation - minElevation) / (maxElevation - minElevation)
  return minSize + normalized * (maxSize - minSize)
}

/**
 * Creates a label for the mountain point
 */
function createMountainLabel(mountain: MountainData): string {
  return \`
    <div class="tooltip-title">\${mountain.name}</div>
    <div class="tooltip-content">
      <strong>Elevation:</strong> \${mountain.elevation.toLocaleString()}m<br/>
      <strong>Country:</strong> \${mountain.country}<br/>
      <strong>Rank:</strong> \${MOUNTAINS_DATA.findIndex((m) => m.name === mountain.name) + 1} of \${MOUNTAINS_DATA.length}
    </div>
  \`
}

/**
 * Converts mountain data to globe points
 */
export function convertMountainsToPoints(): GlobePoint[] {
  return MOUNTAINS_DATA.map((mountain) => ({
    lat: mountain.latitude,
    lng: mountain.longitude,
    size: getElevationSize(mountain.elevation),
    color: getElevationColor(mountain.elevation),
    label: createMountainLabel(mountain),
    data: mountain,
  }))
}

/**
 * Gets statistics about the mountains dataset
 */
export function getMountainStats() {
  const elevations = MOUNTAINS_DATA.map((m) => m.elevation)
  return {
    total: MOUNTAINS_DATA.length,
    minElevation: Math.min(...elevations),
    maxElevation: Math.max(...elevations),
    avgElevation: Math.round(elevations.reduce((a, b) => a + b, 0) / elevations.length),
  }
}
`

    // Write to file
    const outputPath = path.join(__dirname, "../src/data/mountains.ts")
    fs.writeFileSync(outputPath, output, "utf-8")

    console.log(`\n✅ Successfully wrote ${peaks.length} peaks to ${outputPath}`)
    console.log(`📊 Elevation range: ${peaks[peaks.length - 1].elevation}m - ${peaks[0].elevation}m`)
  } catch (error) {
    console.error("❌ Error fetching peaks:", error)
    process.exit(1)
  }
}

main()
