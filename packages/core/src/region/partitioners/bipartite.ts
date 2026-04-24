import type { RNG } from "../../rng/RNG.ts"
import type { Partitioner } from "../Partitioner.ts"
import { cellInRegion, createRegion, type Region } from "../Region.ts"

export class BipartiteGridPartitioner implements Partitioner {
    constructor(
        private readonly cols: number,
        private readonly rows: number,
        private readonly jitter: number = 0  // 0-1, randomly reassigns border cells for organic edges
    ) { }

    partition(region: Region, rng: RNG): Region[] {
        const { x, y, width, height } = region.bounds
        const cellW = Math.floor(width / this.cols)
        const cellH = Math.floor(height / this.rows)

        const maskA = new Uint8Array(width * height)
        const maskB = new Uint8Array(width * height)

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const isA = (row + col) % 2 === 0

                const startX = col * cellW
                const startY = row * cellH
                const endX = col === this.cols - 1 ? width : startX + cellW
                const endY = row === this.rows - 1 ? height : startY + cellH

                for (let py = startY; py < endY; py++) {
                    for (let px = startX; px < endX; px++) {
                        if (!cellInRegion(region, x + px, y + py)) continue

                        // jitter — randomly flip ownership of cells near cell boundaries
                        const nearBoundaryX = (px % cellW) < 2 || (px % cellW) > cellW - 2
                        const nearBoundaryY = (py % cellH) < 2 || (py % cellH) > cellH - 2
                        const flip = (nearBoundaryX || nearBoundaryY) && rng.next() < this.jitter

                        const assignToA = flip ? !isA : isA
                        const idx = py * width + px
                        if (assignToA) maskA[idx] = 1
                        else maskB[idx] = 1
                    }
                }
            }
        }

        return [
            createRegion(maskA, width, height, x, y),
            createRegion(maskB, width, height, x, y)
        ]
    }
}