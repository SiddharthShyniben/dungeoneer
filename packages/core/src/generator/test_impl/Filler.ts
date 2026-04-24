import { BaseTile } from "../../grid/BaseTile.ts";
import type { Grid } from "../../grid/Grid.ts";
import { getCellsInRegion, type Region } from "../../region/Region.ts";
import type { RNG } from "../../rng/RNG.ts";
import type { GeneratorResult, LeafGenerator } from "../Generator.ts";

export class Filler implements LeafGenerator {
    constructor(public readonly id: number) {}

    generate(grid: Grid, region: Region, rng: RNG): GeneratorResult {
        const cells = getCellsInRegion(region);

        for (const { x, y } of cells) {
            grid.set(x, y, { base: BaseTile.Floor });
        }

        return {
            borderPoints: []
        }
    }
}