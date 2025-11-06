import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

import { useAutoCycleContext } from "../contexts/AutoCycleContext"
import { getCurrentGlobeDataset, getCurrentMoleculeId, useAutoCycle } from "../hooks/useAutoCycle"
import { AutoCycleControls } from "./AutoCycleControls"

export function AutoCycleOverlay() {
  const { isEnabled, disable } = useAutoCycleContext()
  const navigate = useNavigate()

  const controls = useAutoCycle({
    initialDuration: 10000,
    onPhaseChange: (phase, index) => {
      if (phase === "globe") {
        const dataset = getCurrentGlobeDataset(index)
        navigate({ to: "/", search: { dataset } })
      } else {
        const molecule = getCurrentMoleculeId(index)
        navigate({ to: "/molecules", search: { molecule } })
      }
    },
  })

  // Keyboard shortcuts
  useEffect(() => {
    if (!isEnabled) return

    const handleKeyPress = (e: KeyboardEvent): void => {
      // Escape = exit auto-cycle
      if (e.code === "Escape") {
        e.preventDefault()
        disable()
      }
      // Space = play/pause
      else if (e.code === "Space" && !e.repeat) {
        e.preventDefault()
        if (controls.state.isRunning) {
          controls.pause()
        } else {
          controls.play()
        }
      }
      // Arrow left = previous
      else if (e.code === "ArrowLeft") {
        e.preventDefault()
        controls.skipBackward()
      }
      // Arrow right = next
      else if (e.code === "ArrowRight") {
        e.preventDefault()
        controls.skipForward()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isEnabled, controls, disable])

  // Trigger initial navigation when auto-cycle is enabled
  useEffect(() => {
    if (isEnabled) {
      const dataset = getCurrentGlobeDataset(controls.state.globeIndex)
      navigate({ to: "/", search: { dataset } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled])

  if (!isEnabled) return null

  return (
    <>
      {/* Semi-transparent overlay (no blur to keep visualization clear) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          zIndex: 999,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Controls panel */}
      <div style={{ position: "relative", zIndex: 1000 }}>
        <AutoCycleControls controls={controls} />
      </div>
    </>
  )
}
