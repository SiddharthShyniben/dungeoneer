import type { RNG } from "../../rng/RNG.ts"
import type { Partitioner } from "../Partitioner.ts"
import { createFilledRegion, type Region } from "../Region.ts"

export class BSPPartitioner implements Partitioner {
    constructor(
        private readonly depth: number = 3,
        private readonly minSize: number = 10,
        private readonly splitRatio: { min: number, max: number } = { min: 0.35, max: 0.65 }
    ) { }

    partition(region: Region, rng: RNG): Region[] {
        const leaves: Region[] = []
        this.split(region, this.depth, rng, leaves)
        return leaves
    }

    private split(region: Region, depth: number, rng: RNG, leaves: Region[]): void {
        const { x, y, width, height } = region.bounds

        if (depth === 0 || (width < this.minSize * 2 && height < this.minSize * 2)) {
            leaves.push(region)
            return
        }

        const splitHorizontal = width < this.minSize * 2 ? true
            : height < this.minSize * 2 ? false
                : rng.nextBool()

        const ratio = rng.next() * (this.splitRatio.max - this.splitRatio.min) + this.splitRatio.min

        if (splitHorizontal) {
            const splitY = Math.floor(y + height * ratio)
            this.split(createFilledRegion(width, splitY - y, x, y), depth - 1, rng, leaves)
            this.split(createFilledRegion(width, y + height - splitY, x, splitY), depth - 1, rng, leaves)
        } else {
            const splitX = Math.floor(x + width * ratio)
            this.split(createFilledRegion(splitX - x, height, x, y), depth - 1, rng, leaves)
            this.split(createFilledRegion(x + width - splitX, height, splitX, y), depth - 1, rng, leaves)
        }
    }
}