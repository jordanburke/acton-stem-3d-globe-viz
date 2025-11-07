import { createContext, type ReactNode, useContext, useState } from "react"

interface AutoCycleContextType {
  isEnabled: boolean
  duration: number
  enable: () => void
  disable: () => void
  toggle: () => void
  setDuration: (duration: number) => void
}

const AutoCycleContext = createContext<AutoCycleContextType | undefined>(undefined)

export function AutoCycleProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(10000) // Default 10 seconds in milliseconds

  const enable = (): void => setIsEnabled(true)
  const disable = (): void => setIsEnabled(false)
  const toggle = (): void => setIsEnabled((prev) => !prev)

  return (
    <AutoCycleContext.Provider value={{ isEnabled, duration, enable, disable, toggle, setDuration }}>
      {children}
    </AutoCycleContext.Provider>
  )
}

export function useAutoCycleContext(): AutoCycleContextType {
  const context = useContext(AutoCycleContext)
  if (!context) {
    throw new Error("useAutoCycleContext must be used within AutoCycleProvider")
  }
  return context
}
