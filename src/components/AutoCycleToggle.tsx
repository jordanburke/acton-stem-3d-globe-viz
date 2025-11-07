import { ActionIcon, Group, NumberInput, Text, Tooltip } from "@mantine/core"
import { IconPresentation, IconPresentationOff } from "@tabler/icons-react"

import { useAutoCycleContext } from "../contexts/AutoCycleContext"

export function AutoCycleToggle() {
  const { isEnabled, duration, toggle, setDuration } = useAutoCycleContext()

  const handleDurationChange = (value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value, 10) : value
    if (!isNaN(numValue) && numValue >= 5 && numValue <= 30) {
      setDuration(numValue * 1000) // Convert seconds to milliseconds
    }
  }

  return (
    <Group gap="sm" align="center">
      {!isEnabled && (
        <Group gap="xs" align="center">
          <Text size="sm" c="dimmed">
            Duration:
          </Text>
          <NumberInput
            value={duration / 1000}
            onChange={handleDurationChange}
            min={5}
            max={30}
            step={1}
            suffix="s"
            size="xs"
            w={70}
            styles={{
              input: {
                textAlign: "center",
              },
            }}
            aria-label="Auto-cycle duration in seconds"
          />
        </Group>
      )}
      <Tooltip label={isEnabled ? "Exit Auto-Cycle Mode" : "Enter Auto-Cycle Mode"} position="bottom">
        <ActionIcon
          size="lg"
          variant={isEnabled ? "filled" : "subtle"}
          color="cyan"
          onClick={toggle}
          aria-label={isEnabled ? "Exit auto-cycle mode" : "Enter auto-cycle mode"}
          title={isEnabled ? "Exit Auto-Cycle (Esc)" : "Start Auto-Cycle"}
        >
          {isEnabled ? <IconPresentationOff size={20} /> : <IconPresentation size={20} />}
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
