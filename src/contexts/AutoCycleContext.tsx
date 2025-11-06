import { createContext, type ReactNode, useContext, useState } from "react"

interface AutoCycleContextType {
  isEnabled: boolean
  enable: () => void
  disable: () => void
  toggle: () => void
}

const AutoCycleContext = createContext<AutoCycleContextType | undefined>(undefined)

export function AutoCycleProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false)

  const enable = (): void => setIsEnabled(true)
  const disable = (): void => setIsEnabled(false)
  const toggle = (): void => setIsEnabled((prev) => !prev)

  return (
    <AutoCycleContext.Provider value={{ isEnabled, enable, disable, toggle }}>{children}</AutoCycleContext.Provider>
  )
}

export function useAutoCycleContext(): AutoCycleContextType {
  const context = useContext(AutoCycleContext)
  if (!context) {
    throw new Error("useAutoCycleContext must be used within AutoCycleProvider")
  }
  return context
}
