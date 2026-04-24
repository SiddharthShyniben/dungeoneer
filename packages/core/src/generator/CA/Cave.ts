import { BaseTile } from "../../grid/BaseTile.ts";
import type { Grid } from "../../grid/Grid.ts";
import { cellInRegion, getCellsInRegion, type Region } from "../../region/Region.ts";
import type { RNG } from "../../rng/RNG.ts";
import type { GeneratorResult, LeafGenerator } from "../Generator.ts";

export class Cave implements LeafGenerator {
    constructor(
        public readonly id: number,
        private readonly initialFillChance: number = 0.40,
        private readonly firstPassIterations: number = 4,
        private readonly secondPassIterations: number = 3,
    ) {}

    generate(grid: Grid, region: Region, rng: RNG): GeneratorResult {
        const cells = getCellsInRegion(region);

        // seed
        for (const { x, y } of cells) {
            grid.set(x, y, { base: rng.next() < this.initialFillChance ? BaseTile.Floor : BaseTile.Wall });
        }

        // first pass — uses both neighbor counts
        for (let i = 0; i < this.firstPassIterations; i++) {
            this.applyRules(grid, region, (neighbors, secondary) =>
                neighbors >= 5 || secondary <= 2 ? BaseTile.Wall : BaseTile.Floor
            );
        }

        // second pass — only primary neighbors
        for (let i = 0; i < this.secondPassIterations; i++) {
            this.applyRules(grid, region, (neighbors) =>
                neighbors >= 5 ? BaseTile.Wall : BaseTile.Floor
            );
        }

        return { borderPoints: [] };
    }

    private applyRules(
        grid: Grid,
        region: Region,
        rule: (neighbors: number, secondary: number) => BaseTile
    ): void {
        const cells = getCellsInRegion(region);
        const updates: { x: number, y: number, tile: BaseTile }[] = [];

        for (const { x, y } of cells) {
            const neighbors = this.countNeighbors(grid, region, x, y, 1);
            const secondary = this.countNeighbors(grid, region, x, y, 2);
            updates.push({ x, y, tile: rule(neighbors, secondary) });
        }

        for (const { x, y, tile } of updates) {
            grid.set(x, y, { base: tile });
        }
    }

    private countNeighbors(grid: Grid, region: Region, x: number, y: number, radius: number): number {
        let count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx === 0 && dy === 0) continue;
                if (radius === 2 && Math.abs(dx) === 2 && Math.abs(dy) === 2) continue;
                const nx = x + dx;
                const ny = y + dy;
                // cells outside region boundary count as walls — keeps caves from bleeding out
                if (!cellInRegion(region, nx, ny)) {
                    count++;
                    continue;
                }
                if (grid.get(nx, ny)?.base === BaseTile.Wall) count++;
            }
        }
        return count;
    }
}