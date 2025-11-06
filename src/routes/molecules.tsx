import { Stack } from "@mantine/core"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { AtomLegend } from "../components/AtomLegend"
import { MoleculeInfo } from "../components/MoleculeInfo"
import { MoleculeSelector } from "../components/MoleculeSelector"
import { MoleculeViewer } from "../components/MoleculeViewer"
import { molecules } from "../data/molecules"

function MoleculesDemo() {
  const navigate = useNavigate()
  const searchParams = Route.useSearch()
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(searchParams.molecule || "water")
  const [autoRotate, setAutoRotate] = useState<boolean>(true)

  const selectedMolecule = molecules.find((m) => m.id === selectedMoleculeId) || molecules[0]

  // Update molecule when URL search param changes (for auto-cycle)
  useEffect(() => {
    if (searchParams.molecule && searchParams.molecule !== selectedMoleculeId) {
      setSelectedMoleculeId(searchParams.molecule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.molecule])

  // Handle manual molecule selection
  const handleMoleculeSelect = (moleculeId: string) => {
    setSelectedMoleculeId(moleculeId)
    navigate({ search: { molecule: moleculeId } })
  }

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        <MoleculeViewer molecule={selectedMolecule} autoRotate={autoRotate} />
        <AtomLegend variant="compact" />
      </div>

      <div
        style={{
          width: 400,
          height: "100%",
          padding: "1rem",
          overflowY: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Stack gap="md">
          <MoleculeSelector
            molecules={molecules}
            selectedMolecule={selectedMolecule}
            onSelectMolecule={handleMoleculeSelect}
            autoRotate={autoRotate}
            onToggleAutoRotate={setAutoRotate}
          />
          <MoleculeInfo molecule={selectedMolecule} />
        </Stack>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/molecules")({
  validateSearch: (search: Record<string, unknown>) => ({
    molecule: (search.molecule as string) || undefined,
  }),
  component: MoleculesDemo,
})
