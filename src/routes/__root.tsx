import { Anchor, AppShell, Group, Stack, Tabs, Text, Title } from "@mantine/core"
import { createRootRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

import { AutoCycleOverlay } from "../components/AutoCycleOverlay"
import { AutoCycleToggle } from "../components/AutoCycleToggle"
import { AutoCycleProvider } from "../contexts/AutoCycleContext"

function RootComponent() {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab from pathname
  const activeTab = location.pathname === "/" ? "globe" : location.pathname.slice(1)

  const handleTabChange = (value: string | null) => {
    if (value) {
      navigate({ to: value === "globe" ? "/" : `/${value}` })
    }
  }

  return (
    <AutoCycleProvider>
      <AppShell header={{ height: 60 }} padding={0}>
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="lg" align="center">
              <Title order={3}>DiscoverSTEM 2025 - Agentic AI Exhibit</Title>
              <Anchor
                href="https://sapientsai.com"
                target="_blank"
                underline="never"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Text size="xs" c="dimmed">
                  Presented by
                </Text>
                <img
                  src="https://sapientsai.com/images/logo.svg"
                  alt="SapientsAI Logo"
                  style={{ height: 20, width: 20 }}
                />
                <Text size="xs" fw={500}>
                  <Text component="span" c="white" inherit>
                    SAPIENTS
                  </Text>
                  <Text component="span" c="violet.5" inherit>
                    AI
                  </Text>
                </Text>
              </Anchor>
            </Group>

            <Group gap="md">
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tabs.List>
                  <Tabs.Tab value="globe">3D Globe</Tabs.Tab>
                  <Tabs.Tab value="molecules">Molecules</Tabs.Tab>
                </Tabs.List>
              </Tabs>

              <AutoCycleToggle />
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}>
          <Outlet />
        </AppShell.Main>

        <AutoCycleOverlay />

        <TanStackRouterDevtools />
      </AppShell>
    </AutoCycleProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
