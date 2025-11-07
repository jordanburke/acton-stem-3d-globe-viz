import { ActionIcon, Group, Paper, Progress, Slider, Stack, Text, Title } from "@mantine/core"
import { IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from "@tabler/icons-react"

import { useAutoCycleContext } from "../contexts/AutoCycleContext"
import type { AutoCycleControls as AutoCycleControlsType } from "../hooks/useAutoCycle"
import { getCurrentGlobeDataset, getCurrentMoleculeId } from "../hooks/useAutoCycle"

interface AutoCycleControlsProps {
  controls: AutoCycleControlsType
}

export function AutoCycleControls({ controls }: AutoCycleControlsProps) {
  const { state, play, pause, skipForward, skipBackward, setDuration } = controls
  const { setDuration: setContextDuration } = useAutoCycleContext()

  const getCurrentViewName = (): string => {
    if (state.currentPhase === "globe") {
      const dataset = getCurrentGlobeDataset(state.globeIndex)
      return dataset.charAt(0).toUpperCase() + dataset.slice(1)
    } else {
      const molecule = getCurrentMoleculeId(state.moleculeIndex)
      const names: Record<string, string> = {
        water: "Water (H₂O)",
        glucose: "Glucose (C₆H₁₂O₆)",
        dna: "DNA Double Helix",
        hemoglobin: "Hemoglobin Protein",
      }
      return names[molecule] || molecule
    }
  }

  const handleDurationChange = (value: number): void => {
    const milliseconds = value * 1000
    setDuration(milliseconds) // Update hook state
    setContextDuration(milliseconds) // Update context for next time
  }

  return (
    <Paper
      p="xl"
      radius="md"
      withBorder
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        minWidth: 360,
        backgroundColor: "rgba(10, 14, 39, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
      role="region"
      aria-label="Auto-cycle controls"
    >
      <Stack gap="lg">
        <Title order={3} c="cyan.4">
          Auto-Cycle Controls
        </Title>

        {/* Current View Indicator */}
        <div>
          <Text size="xs" c="dimmed" mb={4}>
            Currently Showing
          </Text>
          <Text size="lg" fw={600} c="cyan.3">
            {state.currentPhase === "globe" ? "🌍 " : "🧬 "}
            {getCurrentViewName()}
          </Text>
        </div>

        {/* Progress Bar */}
        <div>
          <Text size="xs" c="dimmed" mb={8}>
            Time Remaining
          </Text>
          <Progress
            value={state.progress}
            size="md"
            radius="md"
            color="cyan"
            animated={state.isRunning}
            aria-label={`Progress: ${Math.round(state.progress)}%`}
          />
        </div>

        {/* Playback Controls */}
        <Group gap="xs" justify="center">
          <ActionIcon
            size="lg"
            variant="filled"
            color="gray"
            onClick={skipBackward}
            aria-label="Skip to previous view"
            title="Previous (←)"
          >
            <IconPlayerSkipBack size={20} />
          </ActionIcon>

          <ActionIcon
            size="xl"
            variant="filled"
            color="cyan"
            onClick={state.isRunning ? pause : play}
            aria-label={state.isRunning ? "Pause auto-cycle" : "Play auto-cycle"}
            title={state.isRunning ? "Pause (Space)" : "Play (Space)"}
          >
            {state.isRunning ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
          </ActionIcon>

          <ActionIcon
            size="lg"
            variant="filled"
            color="gray"
            onClick={skipForward}
            aria-label="Skip to next view"
            title="Next (→)"
          >
            <IconPlayerSkipForward size={20} />
          </ActionIcon>
        </Group>

        {/* Duration Control */}
        <div>
          <Text size="sm" c="dimmed" mb="xs">
            Display Duration: {(state.duration / 1000).toFixed(0)}s per view
          </Text>
          <Slider
            value={state.duration / 1000}
            onChange={handleDurationChange}
            min={5}
            max={30}
            step={1}
            marks={[
              { value: 5, label: "5s" },
              { value: 15, label: "15s" },
              { value: 30, label: "30s" },
            ]}
            styles={{
              markLabel: { color: "rgba(255, 255, 255, 0.6)" },
            }}
            aria-label="Display duration in seconds"
          />
        </div>

        {/* Cycle Info */}
        <div>
          <Text size="xs" c="dimmed">
            Phase: {state.currentPhase === "globe" ? "Globe Datasets" : "Molecules"}
          </Text>
          <Text size="xs" c="dimmed">
            {state.currentPhase === "globe"
              ? `Dataset ${state.globeIndex + 1} of 3`
              : `Molecule ${state.moleculeIndex + 1} of 4`}
          </Text>
        </div>
      </Stack>
    </Paper>
  )
}
