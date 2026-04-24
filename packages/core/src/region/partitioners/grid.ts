import type { RNG } from "../../rng/RNG.ts"
import type { Partitioner } from "../Partitioner.ts"
import { createFilledRegion, type Region } from "../Region.ts"

export class GridPartitioner implements Partitioner {
    constructor(
        private readonly cols: number,
        private readonly rows: number
    ) {}

    partition(region: Region, rng: RNG): Region[] {
        const { x, y, width, height } = region.bounds
        const cellW = Math.floor(width / this.cols)
        const cellH = Math.floor(height / this.rows)
        const regions: Region[] = []

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const rx = x + col * cellW
                const ry = y + row * cellH
                // last col/row absorbs remainder
                const rw = col === this.cols - 1 ? width - col * cellW : cellW
                const rh = row === this.rows - 1 ? height - row * cellH : cellH
                regions.push(createFilledRegion(rw, rh, rx, ry))
            }
        }

        return regions
    }
}