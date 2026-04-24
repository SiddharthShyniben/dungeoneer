
import type { Grid } from "../grid/Grid.ts";
import { createFilledRegion, createRegion, type Region } from "../region/Region.ts";
import type { RNG } from "../rng/RNG.ts";
import type { Generator, GeneratorResult } from "./Generator.ts";

interface CompositeGeneratorResult {
    subResults: GeneratorResult[];
}

export class CompositeGenerator {
    constructor(
        private partitioner: (region: Region, rng: RNG) => [Region[], number[]],
        private generators: Generator[]
    ) { }

    generate(grid: Grid, rng: RNG, region: Region = createFilledRegion(grid.width, grid.height)): CompositeGeneratorResult {
        const [subregions, generatorIndices] = this.partitioner(region, rng);
        const results: GeneratorResult[] = [];

        for (let i = 0; i < subregions.length; i++) {
            const subregion = subregions[i];

            if (!subregion) {
                throw new Error(`No subregion provided for index ${i}.`);
            }

            const generatorIndex = generatorIndices[i];

            if (typeof generatorIndex === "undefined") {
                throw new Error(`No generator index provided for subregion ${i}.`);
            }

            const generator = this.generators[generatorIndex];

            if (!generator) {
                throw new Error(`No generator found at index ${generatorIndex} for subregion ${i}.`);
            }

            const result = generator.generate(grid, rng, subregion);
            results.push(result);
        }

        return {
            subResults: results
        };
    }
}