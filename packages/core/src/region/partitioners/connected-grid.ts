import type { RNG } from "../../rng/RNG.ts"
import type { Partitioner } from "../Partitioner.ts"
import { cellInRegion, createRegion, type Region } from "../Region.ts"

export class ConnectedGridPartitioner implements Partitioner {
    constructor(
        private readonly cols: number,
        private readonly rows: number,
        private readonly categories: number = 2,
        private readonly oversample: number = 4,  // seeds per category
        private readonly jitter: number = 0
    ) {}

    partition(region: Region, rng: RNG): Region[] {
        const { x, y, width, height } = region.bounds
        const cellW = Math.floor(width / this.cols)
        const cellH = Math.floor(height / this.rows)
        const totalCells = this.cols * this.rows
        const totalSeeds = this.categories * this.oversample

        if (totalSeeds > totalCells) throw new Error("Too many seeds for grid size")

        // farthest point sampling — each new seed maximally far from all existing ones
        const seedCells = this.placeSeeds(totalSeeds, rng)

        // assign each seed to a category — round robin so each gets oversample seeds
        // seeds are already spread out so round robin gives balanced territory
        const seedCategory = new Int32Array(totalSeeds)
        for (let i = 0; i < totalSeeds; i++) {
            seedCategory[i] = i % this.categories
        }

        // multi-source BFS — all seeds expand simultaneously
        const assignment = new Int32Array(totalCells).fill(-1)
        const queue: number[] = []

        for (let s = 0; s < totalSeeds; s++) {
            assignment[seedCells[s]!] = seedCategory[s]!
            queue.push(seedCells[s]!)
        }

        let head = 0
        while (head < queue.length) {
            const curr = queue[head++]!
            const col = curr % this.cols
            const row = Math.floor(curr / this.cols)
            const owner = assignment[curr]!

            for (const [nc, nr] of [[col+1,row],[col-1,row],[col,row+1],[col,row-1]]) {
                if (nc! < 0 || nc! >= this.cols || nr! < 0 || nr! >= this.rows) continue
                const nidx = nr! * this.cols + nc!
                if (assignment[nidx] !== -1) continue
                assignment[nidx] = owner
                queue.push(nidx)
            }
        }

        // fallback for any missed cells
        for (let i = 0; i < totalCells; i++) {
            if (assignment[i] === -1) assignment[i] = 0
        }

        // build pixel masks
        const masks = Array.from({ length: this.categories }, () => new Uint8Array(width * height))

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let owner = assignment[row * this.cols + col]!

                const startX = col * cellW
                const startY = row * cellH
                const endX = col === this.cols - 1 ? width : startX + cellW
                const endY = row === this.rows - 1 ? height : startY + cellH

                for (let py = startY; py < endY; py++) {
                    for (let px = startX; px < endX; px++) {
                        if (!cellInRegion(region, x + px, y + py)) continue

                        let assigned = owner
                        if (this.jitter > 0) {
                            const nearBoundaryX = (px % cellW) < 2 || (px % cellW) > cellW - 2
                            const nearBoundaryY = (py % cellH) < 2 || (py % cellH) > cellH - 2
                            if ((nearBoundaryX || nearBoundaryY) && rng.next() < this.jitter) {
                                assigned = rng.nextInt(0, this.categories - 1)
                            }
                        }

                        assigned = Math.max(0, Math.min(this.categories - 1, assigned))
                        masks[assigned]![py * width + px] = 1
                    }
                }
            }
        }

        return masks.map(mask => createRegion(mask, width, height, x, y))
    }

    private placeSeeds(count: number, rng: RNG): number[] {
        const totalCells = this.cols * this.rows
        const seeds: number[] = []

        // first seed random
        seeds.push(rng.nextInt(0, totalCells - 1))

        while (seeds.length < count) {
            let bestCell = -1
            let bestDist = -1

            for (let i = 0; i < totalCells; i++) {
                const ic = i % this.cols
                const ir = Math.floor(i / this.cols)

                // distance to nearest existing seed
                let minDist = Infinity
                for (const s of seeds) {
                    const sc = s % this.cols
                    const sr = Math.floor(s / this.cols)
                    const d = Math.abs(ic - sc) + Math.abs(ir - sr)
                    if (d < minDist) minDist = d
                }

                if (minDist > bestDist) {
                    bestDist = minDist
                    bestCell = i
                }
            }

            seeds.push(bestCell)
        }

        return seeds
    }
}