import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          globe: ["globe.gl"],
          react: ["react", "react-dom"],
          mantine: ["@mantine/core", "@mantine/hooks"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
