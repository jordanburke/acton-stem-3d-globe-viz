import { ActionIcon, Tooltip } from "@mantine/core"
import { IconPresentation, IconPresentationOff } from "@tabler/icons-react"

import { useAutoCycleContext } from "../contexts/AutoCycleContext"

export function AutoCycleToggle() {
  const { isEnabled, toggle } = useAutoCycleContext()

  return (
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
  )
}
