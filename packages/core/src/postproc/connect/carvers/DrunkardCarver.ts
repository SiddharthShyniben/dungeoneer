import { BaseTile } from "../../../grid/BaseTile.ts";
import type { Grid } from "../../../grid/Grid.ts";
import type { RNG } from "../../../rng/RNG.ts";
import type { Carver } from "../Carver.ts";

export class DrunkardCarver implements Carver {
    constructor(
        private readonly bias: number = 0.5,   // 0.5 = pure random, 1.0 = straight line
        private readonly tunnelWidth: number = 1
    ) { }

    carve(grid: Grid, from: { x: number, y: number }, to: { x: number, y: number }, rng: RNG): void {
        let cur = { ...from }
        const maxSteps = grid.width * grid.height  // safety cap

        for (let steps = 0; steps < maxSteps; steps++) {
            this.carveAt(grid, cur)

            if (cur.x === to.x && cur.y === to.y) break

            const dx = to.x - cur.x
            const dy = to.y - cur.y

            let stepX = 0
            let stepY = 0

            if (rng.next() < this.bias) {
                // biased step — move toward target on the dominant axis only
                if (Math.abs(dx) >= Math.abs(dy)) stepX = Math.sign(dx)
                else stepY = Math.sign(dy)
            } else {
                // drunk step — pick a completely random cardinal direction
                const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const
                const [rx, ry] = dirs[rng.nextInt(0, 3)]!
                stepX = rx
                stepY = ry
            }

            cur.x = Math.max(0, Math.min(grid.width - 1, cur.x + stepX))
            cur.y = Math.max(0, Math.min(grid.height - 1, cur.y + stepY))
        }

        this.carveAt(grid, to)
    }

    private carveAt(grid: Grid, center: { x: number, y: number }): void {
        const r = Math.floor(this.tunnelWidth / 2)
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const x = center.x + dx
                const y = center.y + dy
                if (grid.inBounds(x, y)) {
                    grid.set(x, y, { base: BaseTile.Floor })
                }
            }
        }
    }
}