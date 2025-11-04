import Globe from "globe.gl"

import type { GlobePoint } from "../data/types"

export class GlobeRenderer {
  private globe: ReturnType<typeof Globe> | null = null
  private container: HTMLElement

  constructor(containerId: string) {
    const element = document.getElementById(containerId)
    if (!element) {
      throw new Error(`Container element with id "${containerId}" not found`)
    }
    this.container = element
    this.initializeGlobe()
  }

  private initializeGlobe(): void {
    this.globe = Globe()(this.container)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      .width(this.container.clientWidth)
      .height(this.container.clientHeight)

    // Configure camera
    this.globe.pointOfView({ altitude: 2.5 })

    // Enable rotation
    this.globe.controls().autoRotate = true
    this.globe.controls().autoRotateSpeed = 0.5

    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this))
  }

  private handleResize(): void {
    if (this.globe) {
      this.globe.width(this.container.clientWidth).height(this.container.clientHeight)
    }
  }

  public setPoints(points: GlobePoint[]): void {
    if (!this.globe) return

    this.globe
      .pointsData(points)
      .pointAltitude("size")
      .pointColor("color")
      .pointRadius(1.0) // Increased from 0.5 to 1.0 for better visibility
      .pointLabel((d) => {
        const point = d as GlobePoint
        return point.label
      })
  }

  public setRotationSpeed(speed: number): void {
    if (!this.globe) return
    this.globe.controls().autoRotateSpeed = speed
  }

  public enableAutoRotate(enabled: boolean): void {
    if (!this.globe) return
    this.globe.controls().autoRotate = enabled
  }

  public destroy(): void {
    window.removeEventListener("resize", this.handleResize.bind(this))
    if (this.globe) {
      // Globe.gl doesn't have a built-in destroy method, but we can clear the container
      this.container.innerHTML = ""
      this.globe = null
    }
  }
}
