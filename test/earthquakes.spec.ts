import { describe, expect, it } from "vitest"

import { convertEarthquakesToPoints, getEarthquakeStats } from "../src/data/earthquakes"
import type { EarthquakeData } from "../src/data/types"

describe("Earthquake Data Processing", () => {
  const mockEarthquakeData: EarthquakeData = {
    type: "FeatureCollection",
    metadata: {
      generated: Date.now(),
      url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
      title: "USGS All Earthquakes, Past Month",
      status: 200,
      api: "1.0.0",
      count: 2,
    },
    features: [
      {
        type: "Feature",
        id: "test1",
        properties: {
          mag: 5.5,
          place: "Test Location 1",
          time: Date.now(),
          updated: Date.now(),
          tz: null,
          url: "https://example.com/1",
          detail: "https://example.com/detail/1",
          felt: null,
          cdi: null,
          mmi: null,
          alert: null,
          status: "reviewed",
          tsunami: 0,
          sig: 500,
          net: "us",
          code: "test1",
          ids: "test1",
          sources: "us",
          types: "origin,phase",
          nst: null,
          dmin: null,
          rms: 0.5,
          gap: null,
          magType: "mb",
          type: "earthquake",
          title: "M 5.5 - Test Location 1",
        },
        geometry: {
          type: "Point",
          coordinates: [-122.0, 37.0, 10.0],
        },
      },
      {
        type: "Feature",
        id: "test2",
        properties: {
          mag: 3.2,
          place: "Test Location 2",
          time: Date.now(),
          updated: Date.now(),
          tz: null,
          url: "https://example.com/2",
          detail: "https://example.com/detail/2",
          felt: null,
          cdi: null,
          mmi: null,
          alert: null,
          status: "reviewed",
          tsunami: 0,
          sig: 200,
          net: "us",
          code: "test2",
          ids: "test2",
          sources: "us",
          types: "origin,phase",
          nst: null,
          dmin: null,
          rms: 0.3,
          gap: null,
          magType: "ml",
          type: "earthquake",
          title: "M 3.2 - Test Location 2",
        },
        geometry: {
          type: "Point",
          coordinates: [140.0, 35.0, 5.0],
        },
      },
    ],
  }

  it("converts earthquake data to globe points", () => {
    const points = convertEarthquakesToPoints(mockEarthquakeData)

    expect(points).toHaveLength(2)
    expect(points[0].lat).toBe(37.0)
    expect(points[0].lng).toBe(-122.0)
    expect(points[0].size).toBeGreaterThan(0)
    expect(points[0].color).toBeTruthy()
    expect(points[0].label).toContain("5.5")
  })

  it("assigns correct colors based on magnitude", () => {
    const points = convertEarthquakesToPoints(mockEarthquakeData)

    // 5.5 magnitude should be orange (#ff9800)
    expect(points[0].color).toBe("#ff9800")

    // 3.2 magnitude should be yellow (#ffeb3b)
    expect(points[1].color).toBe("#ffeb3b")
  })

  it("calculates earthquake statistics correctly", () => {
    const stats = getEarthquakeStats(mockEarthquakeData)

    expect(stats.total).toBe(2)
    expect(stats.maxMagnitude).toBe(5.5)
    expect(stats.minMagnitude).toBe(3.2)
    expect(stats.avgMagnitude).toBeCloseTo(4.35, 2)
    expect(stats.maxDepth).toBe(10.0)
    expect(stats.minDepth).toBe(5.0)
  })

  it("includes time range in statistics", () => {
    const stats = getEarthquakeStats(mockEarthquakeData)

    expect(stats.timeRange).toBeDefined()
    expect(stats.timeRange.start).toBeInstanceOf(Date)
    expect(stats.timeRange.end).toBeInstanceOf(Date)
  })
})
