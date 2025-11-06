import { useEffect, useRef, useState } from "react"

export type CyclePhase = "globe" | "molecule"

export interface AutoCycleState {
  isRunning: boolean
  currentPhase: CyclePhase
  globeIndex: number // 0-2 (mountains, earthquakes, wildfires)
  moleculeIndex: number // 0-3 (water, CO2, DNA, hemoglobin)
  duration: number // milliseconds per view
  progress: number // 0-100 for progress bar
}

export interface AutoCycleControls {
  state: AutoCycleState
  play: () => void
  pause: () => void
  skipForward: () => void
  skipBackward: () => void
  setDuration: (duration: number) => void
}

export interface AutoCycleOptions {
  initialDuration?: number
  onPhaseChange?: (phase: CyclePhase, index: number) => void
}

const GLOBE_DATASETS = ["mountains", "earthquakes", "wildfires"] as const
const MOLECULE_IDS = ["water", "glucose", "dna", "hemoglobin"] as const

export function useAutoCycle(options: AutoCycleOptions = {}): AutoCycleControls {
  const { initialDuration = 10000, onPhaseChange } = options
  const [state, setState] = useState<AutoCycleState>({
    isRunning: true,
    currentPhase: "globe",
    globeIndex: 0,
    moleculeIndex: 0,
    duration: initialDuration,
    progress: 0,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const advance = (): void => {
    setState((prev) => {
      let newState: AutoCycleState
      if (prev.currentPhase === "globe") {
        if (prev.globeIndex < GLOBE_DATASETS.length - 1) {
          // Move to next globe dataset
          newState = { ...prev, globeIndex: prev.globeIndex + 1, progress: 0 }
        } else {
          // Switch to molecule phase
          newState = { ...prev, currentPhase: "molecule", moleculeIndex: 0, progress: 0 }
        }
      } else {
        if (prev.moleculeIndex < MOLECULE_IDS.length - 1) {
          // Move to next molecule
          newState = { ...prev, moleculeIndex: prev.moleculeIndex + 1, progress: 0 }
        } else {
          // Cycle back to globe phase
          newState = { ...prev, currentPhase: "globe", globeIndex: 0, progress: 0 }
        }
      }

      // Trigger callback with new phase/index
      if (onPhaseChange) {
        const index = newState.currentPhase === "globe" ? newState.globeIndex : newState.moleculeIndex
        onPhaseChange(newState.currentPhase, index)
      }

      return newState
    })
    startTimeRef.current = Date.now()
  }

  const goBack = (): void => {
    setState((prev) => {
      let newState: AutoCycleState
      if (prev.currentPhase === "globe") {
        if (prev.globeIndex > 0) {
          // Move to previous globe dataset
          newState = { ...prev, globeIndex: prev.globeIndex - 1, progress: 0 }
        } else {
          // Switch to last molecule
          newState = {
            ...prev,
            currentPhase: "molecule",
            moleculeIndex: MOLECULE_IDS.length - 1,
            progress: 0,
          }
        }
      } else {
        if (prev.moleculeIndex > 0) {
          // Move to previous molecule
          newState = { ...prev, moleculeIndex: prev.moleculeIndex - 1, progress: 0 }
        } else {
          // Go back to last globe dataset
          newState = {
            ...prev,
            currentPhase: "globe",
            globeIndex: GLOBE_DATASETS.length - 1,
            progress: 0,
          }
        }
      }

      // Trigger callback with new phase/index
      if (onPhaseChange) {
        const index = newState.currentPhase === "globe" ? newState.globeIndex : newState.moleculeIndex
        onPhaseChange(newState.currentPhase, index)
      }

      return newState
    })
    startTimeRef.current = Date.now()
  }

  const play = (): void => {
    setState((prev) => ({ ...prev, isRunning: true }))
    startTimeRef.current = Date.now()
  }

  const pause = (): void => {
    setState((prev) => ({ ...prev, isRunning: false }))
  }

  const skipForward = (): void => {
    advance()
  }

  const skipBackward = (): void => {
    goBack()
  }

  const setDuration = (duration: number): void => {
    setState((prev) => ({ ...prev, duration, progress: 0 }))
    startTimeRef.current = Date.now()
  }

  // Main cycle timer
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        advance()
      }, state.duration)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isRunning, state.duration])

  // Progress bar updater (updates every 100ms)
  useEffect(() => {
    if (state.isRunning) {
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min((elapsed / state.duration) * 100, 100)
        setState((prev) => ({ ...prev, progress }))
      }, 100)

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    }
  }, [state.isRunning, state.duration])

  return {
    state,
    play,
    pause,
    skipForward,
    skipBackward,
    setDuration,
  }
}

// Helper functions to get current dataset/molecule names
export function getCurrentGlobeDataset(index: number): (typeof GLOBE_DATASETS)[number] {
  return GLOBE_DATASETS[index] || GLOBE_DATASETS[0]
}

export function getCurrentMoleculeId(index: number): (typeof MOLECULE_IDS)[number] {
  return MOLECULE_IDS[index] || MOLECULE_IDS[0]
}
