import type { Grid } from "../grid/Grid.ts"
import type { RNG } from "../index.ts"

export interface PostProcessor {
    process(grid: Grid, rng: RNG): void
}

export function runPipeline(grid: Grid, rng: RNG, processors: PostProcessor[]): void {
    for (const processor of processors) {
        processor.process(grid, rng)
    }
}