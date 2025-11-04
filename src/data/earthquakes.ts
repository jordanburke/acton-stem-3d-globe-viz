import type { EarthquakeData, EarthquakeFeature, GlobePoint } from "./types"

const USGS_API_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

/**
 * Fetches earthquake data from the USGS API for the last 30 days
 */
export async function fetchEarthquakeData(): Promise<EarthquakeData> {
  const response = await fetch(USGS_API_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake data: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Gets the color based on earthquake magnitude
 */
function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 7.0) return "#d32f2f" // Dark red - Major
  if (magnitude >= 6.0) return "#f44336" // Red - Strong
  if (magnitude >= 5.0) return "#ff9800" // Orange - Moderate
  if (magnitude >= 4.0) return "#ffc107" // Amber - Light
  if (magnitude >= 3.0) return "#ffeb3b" // Yellow - Minor
  if (magnitude >= 2.0) return "#cddc39" // Lime - Very minor
  return "#8bc34a" // Green - Micro
}

/**
 * Calculates the size multiplier based on magnitude
 */
function getMagnitudeSize(magnitude: number): number {
  // Scale exponentially to make larger earthquakes more visible
  // Increased multiplier from 0.003 to 0.015 for better visibility (5x larger)
  return Math.pow(magnitude, 1.5) * 0.015
}

/**
 * Formats the earthquake timestamp to a readable string
 */
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Creates a label for the earthquake point
 */
function createEarthquakeLabel(feature: EarthquakeFeature): string {
  const props = feature.properties
  const magnitude = props.mag !== null ? props.mag.toFixed(1) : "N/A"
  const depth = feature.geometry.coordinates[2] !== null ? feature.geometry.coordinates[2].toFixed(1) : "N/A"

  return `
    <div class="tooltip-title">${props.title}</div>
    <div class="tooltip-content">
      <strong>Magnitude:</strong> ${magnitude}<br/>
      <strong>Depth:</strong> ${depth} km<br/>
      <strong>Time:</strong> ${formatTime(props.time)}<br/>
      <strong>Location:</strong> ${props.place}
      ${props.tsunami ? '<br/><strong style="color: #ff5252;">⚠️ Tsunami Warning</strong>' : ""}
    </div>
  `
}

/**
 * Converts earthquake GeoJSON features to globe points
 */
export function convertEarthquakesToPoints(data: EarthquakeData): GlobePoint[] {
  return data.features
    .filter((feature) => feature.properties.mag !== null) // Filter out earthquakes with null magnitude
    .map((feature) => {
      const [lng, lat, depth] = feature.geometry.coordinates
      const magnitude = feature.properties.mag

      return {
        lat,
        lng,
        size: getMagnitudeSize(magnitude),
        color: getMagnitudeColor(magnitude),
        label: createEarthquakeLabel(feature),
        data: feature,
      }
    })
}

/**
 * Filters earthquakes by minimum magnitude
 */
export function filterEarthquakesByMagnitude(points: GlobePoint[], minMagnitude: number): GlobePoint[] {
  return points.filter((point) => {
    const feature = point.data as EarthquakeFeature
    return feature.properties.mag >= minMagnitude
  })
}

/**
 * Gets statistics about the earthquake dataset
 */
export function getEarthquakeStats(data: EarthquakeData) {
  const magnitudes = data.features.map((f) => f.properties.mag)
  const depths = data.features.map((f) => f.geometry.coordinates[2])

  return {
    total: data.features.length,
    maxMagnitude: Math.max(...magnitudes),
    minMagnitude: Math.min(...magnitudes),
    avgMagnitude: magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length,
    maxDepth: Math.max(...depths),
    minDepth: Math.min(...depths),
    avgDepth: depths.reduce((a, b) => a + b, 0) / depths.length,
    timeRange: {
      start: new Date(Math.min(...data.features.map((f) => f.properties.time))),
      end: new Date(Math.max(...data.features.map((f) => f.properties.time))),
    },
  }
}
