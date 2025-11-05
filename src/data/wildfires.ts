import type { GlobePoint } from "./types"

// NASA FIRMS (Fire Information for Resource Management System) - Last 24 hours
// Get your free API key at: https://firms.modaps.eosdis.nasa.gov/api/area/
// Using VIIRS_SNPP_NRT sensor (375m resolution) for global coverage
// Replace with your actual API key or set VITE_NASA_FIRMS_API_KEY environment variable
const NASA_FIRMS_API_KEY = import.meta.env.VITE_NASA_FIRMS_API_KEY || ""

/**
 * Gets the NASA FIRMS API URL for the last 24 hours
 * Format: /api/area/csv/{API_KEY}/{source}/world/{day_range}/{date}
 */
function getFirmsURL(): string {
  if (!NASA_FIRMS_API_KEY) return ""

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${NASA_FIRMS_API_KEY}/VIIRS_SNPP_NRT/world/1/${today}`
}

// Sample wildfire data for demo purposes (when API key is not available)
const SAMPLE_WILDFIRE_DATA: WildfireData[] = [
  {
    latitude: -23.5,
    longitude: -46.6,
    brightness: 315.5,
    scan: 1.2,
    track: 1.1,
    acq_date: "2024-11-04",
    acq_time: "1430",
    satellite: "N",
    confidence: 85,
    version: "2.0NRT",
    bright_t31: 290.3,
    frp: 12.5,
    daynight: "D",
  },
  {
    latitude: 37.8,
    longitude: -122.4,
    brightness: 328.2,
    scan: 1.3,
    track: 1.2,
    acq_date: "2024-11-04",
    acq_time: "2115",
    satellite: "N",
    confidence: 92,
    version: "2.0NRT",
    bright_t31: 295.1,
    frp: 45.8,
    daynight: "N",
  },
  {
    latitude: -15.8,
    longitude: -47.9,
    brightness: 340.1,
    scan: 1.4,
    track: 1.2,
    acq_date: "2024-11-04",
    acq_time: "1545",
    satellite: "N",
    confidence: 78,
    version: "2.0NRT",
    bright_t31: 298.7,
    frp: 125.3,
    daynight: "D",
  },
  {
    latitude: -3.1,
    longitude: -60.0,
    brightness: 355.8,
    scan: 1.5,
    track: 1.3,
    acq_date: "2024-11-04",
    acq_time: "1630",
    satellite: "N",
    confidence: 95,
    version: "2.0NRT",
    bright_t31: 305.2,
    frp: 580.7,
    daynight: "D",
  },
  {
    latitude: -10.5,
    longitude: -62.3,
    brightness: 368.4,
    scan: 1.6,
    track: 1.4,
    acq_date: "2024-11-04",
    acq_time: "1700",
    satellite: "N",
    confidence: 88,
    version: "2.0NRT",
    bright_t31: 312.5,
    frp: 1205.2,
    daynight: "D",
  },
]

interface WildfireData {
  latitude: number
  longitude: number
  brightness: number
  scan: number
  track: number
  acq_date: string
  acq_time: string
  satellite: string
  confidence: number
  version: string
  bright_t31: number
  frp: number
  daynight: string
}

/**
 * Fetches wildfire data from NASA FIRMS for the last 24 hours
 * Falls back to sample data if API key is not configured
 */
export async function fetchWildfireData(): Promise<WildfireData[]> {
  const firmsURL = getFirmsURL()

  // Use sample data if no API key is configured
  if (!firmsURL) {
    console.warn(
      "NASA FIRMS API key not configured. Using sample data. Get your free API key at: https://firms.modaps.eosdis.nasa.gov/api/area/",
    )
    return Promise.resolve(SAMPLE_WILDFIRE_DATA)
  }

  const response = await fetch(firmsURL)

  if (!response.ok) {
    throw new Error(`Failed to fetch wildfire data: ${response.statusText}`)
  }

  const csvText = await response.text()
  return parseCSV(csvText)
}

/**
 * Parses CSV data from NASA FIRMS
 * CSV Format: latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_t31,frp,daynight
 */
function parseCSV(csvText: string): WildfireData[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1) // Skip header row
    .map((line) => {
      const values = line.split(",")

      return {
        latitude: parseFloat(values[0]),
        longitude: parseFloat(values[1]),
        brightness: parseFloat(values[2]),
        scan: parseFloat(values[3]),
        track: parseFloat(values[4]),
        acq_date: values[5],
        acq_time: values[6],
        satellite: values[7],
        confidence: parseFloat(values[8]),
        version: values[9],
        bright_t31: parseFloat(values[10]),
        frp: parseFloat(values[11]),
        daynight: values[12],
      }
    })
    .filter((fire) => !isNaN(fire.latitude) && !isNaN(fire.longitude) && !isNaN(fire.frp))
}

/**
 * Gets color based on fire radiative power (FRP)
 */
function getFireColor(frp: number): string {
  if (frp >= 1000) return "#ff0000" // Bright red - Extreme fire
  if (frp >= 500) return "#ff4500" // Orange red - Very high intensity
  if (frp >= 100) return "#ff8c00" // Dark orange - High intensity
  if (frp >= 50) return "#ffa500" // Orange - Moderate intensity
  if (frp >= 10) return "#ffb347" // Light orange - Low intensity
  return "#ffd700" // Gold - Very low intensity
}

/**
 * Gets size based on fire radiative power
 */
function getFireSize(frp: number): number {
  // Scale logarithmically since FRP has huge range
  return Math.log10(frp + 1) * 0.02
}

/**
 * Creates a label for the wildfire point
 */
function createWildfireLabel(fire: WildfireData): string {
  return `
    <div class="tooltip-title">🔥 Wildfire Detection</div>
    <div class="tooltip-content">
      <strong>Fire Radiative Power:</strong> ${fire.frp.toFixed(1)} MW<br/>
      <strong>Brightness:</strong> ${fire.brightness.toFixed(1)}K<br/>
      <strong>Confidence:</strong> ${fire.confidence}%<br/>
      <strong>Time:</strong> ${fire.acq_date} ${fire.acq_time}<br/>
      <strong>Satellite:</strong> ${fire.satellite}<br/>
      <strong>Day/Night:</strong> ${fire.daynight === "D" ? "Day" : "Night"}
    </div>
  `
}

/**
 * Converts wildfire data to globe points
 */
export function convertWildfiresToPoints(data: WildfireData[]): GlobePoint[] {
  return data
    .filter((fire) => !isNaN(fire.latitude) && !isNaN(fire.longitude) && !isNaN(fire.frp))
    .map((fire) => ({
      lat: fire.latitude,
      lng: fire.longitude,
      size: getFireSize(fire.frp),
      color: getFireColor(fire.frp),
      label: createWildfireLabel(fire),
      data: fire,
    }))
}

/**
 * Gets statistics about wildfire data
 */
export function getWildfireStats(data: WildfireData[]) {
  const frpValues = data.map((f) => f.frp).filter((v) => !isNaN(v))

  return {
    total: data.length,
    maxFRP: Math.max(...frpValues),
    minFRP: Math.min(...frpValues),
    avgFRP: frpValues.reduce((a, b) => a + b, 0) / frpValues.length,
    dayFires: data.filter((f) => f.daynight === "D").length,
    nightFires: data.filter((f) => f.daynight === "N").length,
  }
}
