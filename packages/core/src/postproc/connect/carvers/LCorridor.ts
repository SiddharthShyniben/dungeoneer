import { BaseTile } from "../../../grid/BaseTile.ts";
import type { Grid } from "../../../grid/Grid.ts";
import type { RNG } from "../../../rng/RNG.ts";
import type { Carver } from "../Carver.ts";

export class LCorridorCarver implements Carver {
    constructor(private readonly horizontalFirst: boolean | null = null) {}

    carve(grid: Grid, from: { x: number, y: number }, to: { x: number, y: number }, rng: RNG): void {
        const goHorizontalFirst = this.horizontalFirst ?? rng.nextBool()
        const corner = goHorizontalFirst
            ? { x: to.x,   y: from.y }
            : { x: from.x, y: to.y   }

        this.carveLine(grid, from, corner)
        this.carveLine(grid, corner, to)
    }

    private carveLine(grid: Grid, from: { x: number, y: number }, to: { x: number, y: number }): void {
        const dx = Math.sign(to.x - from.x)
        const dy = Math.sign(to.y - from.y)
        let { x, y } = from
        while (x !== to.x || y !== to.y) {
            grid.set(x, y, { base: BaseTile.Floor })
            if (x !== to.x) x += dx
            else y += dy
        }
        grid.set(to.x, to.y, { base: BaseTile.Floor })
    }
}