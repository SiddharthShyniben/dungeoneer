import type { Grid } from "../../grid/Grid.ts"
import type { RNG } from "../../rng/RNG.ts"
import type { PostProcessor } from "../PostProcessor.ts"
import type { Carver } from "./Carver.ts"
import type { ConnectionStrategy } from "./ConnectionStrategy.ts"
import { findComponents } from "./graphing.ts"

export class Connector implements PostProcessor {
  constructor(
    private strategy: ConnectionStrategy,
    private carver: Carver,
  ) { }

  process(grid: Grid, rng: RNG): void {
    const components = findComponents(grid)
    if (components.length <= 1) return
    const connections = this.strategy.connect(components, grid.width)
    for (const { from, to } of connections) {
      this.carver.carve(grid, from, to, rng)
    }
  }
}
