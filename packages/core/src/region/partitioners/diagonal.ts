import type { RNG } from "../../rng/RNG.ts"
import type { Partitioner } from "../Partitioner.ts"
import { cellInRegion, createRegion, type Region } from "../Region.ts"

type DiagonalDirection = 'TL_BR' | 'TR_BL'  // which diagonal

export class DiagonalPartitioner implements Partitioner {
    constructor(private readonly direction: DiagonalDirection = 'TL_BR') {}

    partition(region: Region, rng: RNG): Region[] {
        const { x, y, width, height } = region.bounds
        const size = width * height

        const maskA = new Uint8Array(size)
        const maskB = new Uint8Array(size)

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (!cellInRegion(region, x + col, y + row)) continue
                const idx = row * width + col
                // normalize col/row to [0,1] and compare
                const normX = col / width
                const normY = row / height
                const inA = this.direction === 'TL_BR'
                    ? normY < normX          // above the \ diagonal
                    : normY < (1 - normX)    // above the / diagonal
                if (inA) maskA[idx] = 1
                else     maskB[idx] = 1
            }
        }

        return [
            createRegion(maskA, width, height, x, y),
            createRegion(maskB, width, height, x, y)
        ]
    }
}