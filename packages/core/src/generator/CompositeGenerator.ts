
import type { Grid } from "../grid/Grid.ts";
import type { Region } from "../region/Region.ts";
import type { RNG } from "../rng/RNG.ts";
import type { Generator, GeneratorResult } from "./Generator.ts";

export class CompositeGenerator implements Generator {
    constructor(
        private partitioner: (region: Region, rng: RNG) => Region[],
        private generators: Generator[]  // one per sub-region
    ) { }

    generate(grid: Grid, region: Region, rng: RNG): GeneratorResult {
        throw new Error("Not implemented");
    }
}