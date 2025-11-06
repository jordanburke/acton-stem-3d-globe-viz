import { LoadingOverlay } from "@mantine/core"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"

import { ControlsPanel } from "../components/ControlsPanel"
import { DatasetLegend } from "../components/DatasetLegend"
import { Globe } from "../components/Globe"
import { InfoPanel } from "../components/InfoPanel"
import { convertEarthquakesToPoints, fetchEarthquakeData, getEarthquakeStats } from "../data/earthquakes"
import { convertMountainsToPoints, getMountainStats } from "../data/mountains"
import type { GlobePoint } from "../data/types"
import { convertWildfiresToPoints, fetchWildfireData, getWildfireStats } from "../data/wildfires"

function GlobeDemo() {
  const navigate = useNavigate()
  const searchParams = Route.useSearch()
  const [dataset, setDataset] = useState<string>(searchParams.dataset || "mountains")
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.5)
  const [points, setPoints] = useState<GlobePoint[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [stats, setStats] = useState<{
    total: number
    maxMagnitude?: number
    avgMagnitude?: number
  }>({ total: 0 })

  const handleLoadData = useCallback(async () => {
    if (dataset === "mountains") {
      const mountainPoints = convertMountainsToPoints()
      const mountainStats = getMountainStats()

      setPoints(mountainPoints)
      setStats({
        total: mountainStats.total,
        maxMagnitude: mountainStats.maxElevation,
        avgMagnitude: mountainStats.avgElevation,
      })
    } else if (dataset === "earthquakes") {
      setLoading(true)
      try {
        const earthquakeData = await fetchEarthquakeData()
        const earthquakePoints = convertEarthquakesToPoints(earthquakeData)
        const earthquakeStats = getEarthquakeStats(earthquakeData)

        setPoints(earthquakePoints)
        setStats({
          total: earthquakeStats.total,
          maxMagnitude: earthquakeStats.maxMagnitude,
          avgMagnitude: earthquakeStats.avgMagnitude,
        })
      } catch (error) {
        console.error("Failed to load earthquake data:", error)
      } finally {
        setLoading(false)
      }
    } else if (dataset === "wildfires") {
      setLoading(true)
      try {
        const wildfireData = await fetchWildfireData()
        const wildfirePoints = convertWildfiresToPoints(wildfireData)
        const wildfireStats = getWildfireStats(wildfireData)

        setPoints(wildfirePoints)
        setStats({
          total: wildfireStats.total,
          maxMagnitude: wildfireStats.maxFRP,
          avgMagnitude: wildfireStats.avgFRP,
        })
      } catch (error) {
        console.error("Failed to load wildfire data:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [dataset])

  const handleDatasetChange = (value: string | null) => {
    if (value) {
      setDataset(value)
      navigate({ search: { dataset: value } })
    }
  }

  // Update dataset when URL search param changes (for auto-cycle)
  useEffect(() => {
    if (searchParams.dataset && searchParams.dataset !== dataset) {
      setDataset(searchParams.dataset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.dataset])

  // Auto-load data when dataset changes
  useEffect(() => {
    handleLoadData()
  }, [handleLoadData])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      <Globe points={points} rotationSpeed={rotationSpeed} />

      <DatasetLegend dataset={dataset} />

      <ControlsPanel
        dataset={dataset}
        rotationSpeed={rotationSpeed}
        onDatasetChange={handleDatasetChange}
        onRotationSpeedChange={setRotationSpeed}
        onLoadData={handleLoadData}
        loading={loading}
      />

      <InfoPanel
        totalPoints={stats.total}
        dataset={dataset}
        maxMagnitude={stats.maxMagnitude}
        avgMagnitude={stats.avgMagnitude}
      />
    </div>
  )
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    dataset: (search.dataset as string) || undefined,
  }),
  component: GlobeDemo,
})
