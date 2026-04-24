import type { Grid } from "../grid/Grid.ts"
import type { Region } from "../region/Region.ts"
import type { RNG } from "../rng/RNG.ts"

export interface BorderPoint {
    x: number
    y: number
    direction: 'N' | 'S' | 'E' | 'W'
}

export interface GeneratorResult {
    borderPoints: BorderPoint[]
}

export interface Generator {
    generate(grid: Grid, rng: RNG, region?: Region): GeneratorResult
}

export interface LeafGenerator extends Generator {
    readonly id: number
}

let idCounter = 0;
export const generatorId = () => idCounter++;