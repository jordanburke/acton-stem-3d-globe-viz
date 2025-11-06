import { Box, Paper, Stack, Text, Title } from "@mantine/core"

interface DatasetLegendProps {
  dataset: string
}

interface LegendItem {
  color: string
  label: string
}

interface DatasetInfo {
  title: string
  description: string
  legend: LegendItem[]
}

const DATASET_INFO: Record<string, DatasetInfo> = {
  mountains: {
    title: "Mountain Peaks",
    description: "Visualization of the world's highest mountains over 1000m elevation.",
    legend: [
      { color: "#d32f2f", label: "8000m+ (Extreme)" },
      { color: "#ff6f00", label: "7000-8000m" },
      { color: "#ffa726", label: "6000-7000m" },
      { color: "#ffeb3b", label: "5000-6000m" },
      { color: "#aed581", label: "3000-5000m" },
      { color: "#66bb6a", label: "2000-3000m" },
      { color: "#42a5f5", label: "1000-2000m" },
    ],
  },
  earthquakes: {
    title: "Earthquakes",
    description: "Real-time seismic activity from USGS for the last 30 days, colored by magnitude.",
    legend: [
      { color: "#d32f2f", label: "7.0+ (Major)" },
      { color: "#f44336", label: "6.0-7.0 (Strong)" },
      { color: "#ff6b9d", label: "5.0-6.0 (Moderate)" },
      { color: "#ba68c8", label: "4.0-5.0 (Light)" },
      { color: "#7e57c2", label: "3.0-4.0 (Minor)" },
      { color: "#5c6bc0", label: "2.0-3.0 (Very Minor)" },
      { color: "#42a5f5", label: "<2.0 (Micro)" },
    ],
  },
  wildfires: {
    title: "Wildfires",
    description: "Active fires (10+ MW) detected by NASA FIRMS satellite in the last 24 hours.",
    legend: [
      { color: "#ff0000", label: "1000+ MW (Extreme)" },
      { color: "#ff2200", label: "700-1000 MW" },
      { color: "#ff4400", label: "500-700 MW" },
      { color: "#ff6600", label: "300-500 MW" },
      { color: "#ff8800", label: "200-300 MW" },
      { color: "#ffaa00", label: "100-200 MW" },
    ],
  },
}

export function DatasetLegend({ dataset }: DatasetLegendProps) {
  const info = DATASET_INFO[dataset]

  if (!info) return null

  return (
    <Paper
      p="md"
      radius="md"
      withBorder
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        maxWidth: 300,
        backgroundColor: "rgba(10, 14, 39, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <Stack gap="sm">
        <Title order={5} c="cyan.4">
          {info.title}
        </Title>

        <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
          {info.description}
        </Text>

        <Stack gap={4} mt="xs">
          <Text size="xs" fw={600} c="dimmed" mb={4}>
            COLOR LEGEND
          </Text>
          {info.legend.map((item, index) => (
            <Box key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Box
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              />
              <Text size="xs" c="dimmed">
                {item.label}
              </Text>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}
