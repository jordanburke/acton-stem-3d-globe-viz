import "./styles/main.css"

import { convertEarthquakesToPoints, fetchEarthquakeData, getEarthquakeStats } from "./data/earthquakes"
import type { GlobePoint } from "./data/types"
import { GlobeRenderer } from "./globe/GlobeRenderer"

class App {
  private globeRenderer: GlobeRenderer | null = null

  constructor() {
    this.init()
  }

  private init(): void {
    this.setupUI()
    this.initializeGlobe()
  }

  private setupUI(): void {
    const app = document.getElementById("app")
    if (!app) return

    app.innerHTML = `
      <div class="loading" id="loading">Loading Globe...</div>
      <div id="globe-container"></div>

      <div class="controls-panel">
        <h2>Globe Controls</h2>

        <div class="control-group">
          <label for="dataset-select">Dataset:</label>
          <select id="dataset-select">
            <option value="earthquakes">Earthquakes (Last 30 Days)</option>
            <option value="sample" selected>Sample Data</option>
          </select>
        </div>

        <div class="control-group">
          <label for="rotation-speed">Rotation Speed:</label>
          <input type="range" id="rotation-speed" min="0" max="2" step="0.1" value="0.5" />
        </div>

        <div class="control-group">
          <button id="load-data">Load Data</button>
        </div>
      </div>

      <div class="info-panel">
        <h3>Statistics</h3>
        <div class="stat">
          <span class="stat-label">Total Points:</span>
          <span class="stat-value" id="total-points">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Dataset:</span>
          <span class="stat-value" id="current-dataset">Sample Data</span>
        </div>
        <div class="stat" id="max-magnitude-stat" style="display: none;">
          <span class="stat-label">Max Magnitude:</span>
          <span class="stat-value" id="max-magnitude">-</span>
        </div>
        <div class="stat" id="avg-magnitude-stat" style="display: none;">
          <span class="stat-label">Avg Magnitude:</span>
          <span class="stat-value" id="avg-magnitude">-</span>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private attachEventListeners(): void {
    const rotationSpeed = document.getElementById("rotation-speed") as HTMLInputElement
    rotationSpeed?.addEventListener("input", (e) => {
      const speed = parseFloat((e.target as HTMLInputElement).value)
      this.globeRenderer?.setRotationSpeed(speed)
    })

    const loadDataButton = document.getElementById("load-data") as HTMLButtonElement
    loadDataButton?.addEventListener("click", () => {
      this.loadData()
    })

    const datasetSelect = document.getElementById("dataset-select") as HTMLSelectElement
    datasetSelect?.addEventListener("change", (e) => {
      const dataset = (e.target as HTMLSelectElement).value
      this.updateCurrentDataset(dataset)
    })
  }

  private initializeGlobe(): void {
    try {
      this.globeRenderer = new GlobeRenderer("globe-container")

      // Hide loading indicator
      const loading = document.getElementById("loading")
      if (loading) {
        loading.style.display = "none"
      }

      // Load initial sample data
      this.loadSampleData()
    } catch (error) {
      console.error("Failed to initialize globe:", error)
      const loading = document.getElementById("loading")
      if (loading) {
        loading.textContent = "Error loading globe. Please refresh the page."
      }
    }
  }

  private loadSampleData(): void {
    const samplePoints: GlobePoint[] = [
      {
        lat: 40.7128,
        lng: -74.006,
        size: 0.05,
        color: "#ff6b6b",
        label: "New York City",
        data: { city: "New York" },
      },
      {
        lat: 51.5074,
        lng: -0.1278,
        size: 0.05,
        color: "#4ecdc4",
        label: "London",
        data: { city: "London" },
      },
      {
        lat: 35.6762,
        lng: 139.6503,
        size: 0.05,
        color: "#45b7d1",
        label: "Tokyo",
        data: { city: "Tokyo" },
      },
      {
        lat: -33.8688,
        lng: 151.2093,
        size: 0.05,
        color: "#96ceb4",
        label: "Sydney",
        data: { city: "Sydney" },
      },
      {
        lat: 37.7749,
        lng: -122.4194,
        size: 0.05,
        color: "#ffeaa7",
        label: "San Francisco",
        data: { city: "San Francisco" },
      },
    ]

    this.globeRenderer?.setPoints(samplePoints)
    this.updateStats(samplePoints.length)
    this.hideEarthquakeStats()
  }

  private async loadData(): Promise<void> {
    const datasetSelect = document.getElementById("dataset-select") as HTMLSelectElement
    const dataset = datasetSelect?.value

    if (dataset === "sample") {
      this.loadSampleData()
    } else if (dataset === "earthquakes") {
      await this.loadEarthquakeData()
    }
  }

  private async loadEarthquakeData(): Promise<void> {
    try {
      const loadButton = document.getElementById("load-data") as HTMLButtonElement
      if (loadButton) loadButton.textContent = "Loading..."

      // Fetch earthquake data from USGS
      const earthquakeData = await fetchEarthquakeData()

      // Convert to globe points
      const points = convertEarthquakesToPoints(earthquakeData)

      // Update globe visualization
      this.globeRenderer?.setPoints(points)

      // Get statistics
      const stats = getEarthquakeStats(earthquakeData)

      // Update UI with stats
      this.updateStats(stats.total)
      this.updateEarthquakeStats(stats)

      if (loadButton) loadButton.textContent = "Load Data"

      console.log(`Loaded ${stats.total} earthquakes`)
      console.log(`Magnitude range: ${stats.minMagnitude.toFixed(1)} - ${stats.maxMagnitude.toFixed(1)}`)
    } catch (error) {
      console.error("Failed to load earthquake data:", error)
      alert("Failed to load earthquake data. Please check your internet connection and try again.")
      const loadButton = document.getElementById("load-data") as HTMLButtonElement
      if (loadButton) loadButton.textContent = "Load Data"
    }
  }

  private updateEarthquakeStats(stats: ReturnType<typeof getEarthquakeStats>): void {
    const maxMag = document.getElementById("max-magnitude")
    const avgMag = document.getElementById("avg-magnitude")
    const maxMagStat = document.getElementById("max-magnitude-stat")
    const avgMagStat = document.getElementById("avg-magnitude-stat")

    if (maxMag && avgMag && maxMagStat && avgMagStat) {
      maxMag.textContent = stats.maxMagnitude.toFixed(1)
      avgMag.textContent = stats.avgMagnitude.toFixed(1)
      maxMagStat.style.display = "flex"
      avgMagStat.style.display = "flex"
    }
  }

  private hideEarthquakeStats(): void {
    const maxMagStat = document.getElementById("max-magnitude-stat")
    const avgMagStat = document.getElementById("avg-magnitude-stat")

    if (maxMagStat && avgMagStat) {
      maxMagStat.style.display = "none"
      avgMagStat.style.display = "none"
    }
  }

  private updateStats(count: number): void {
    const totalPoints = document.getElementById("total-points")
    if (totalPoints) {
      totalPoints.textContent = count.toString()
    }
  }

  private updateCurrentDataset(dataset: string): void {
    const currentDataset = document.getElementById("current-dataset")
    if (currentDataset) {
      currentDataset.textContent = dataset === "sample" ? "Sample Data" : "Earthquakes (Last 30 Days)"
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new App())
} else {
  new App()
}
