export interface RNG {
    next(): number
    nextInt(min: number, max: number): number
    nextBool(): boolean
    fork(): RNG
}

export class DefaultRNG implements RNG {
    private rng: () => number

    constructor(public seed: string) {
        this.rng = mulberry32(this.hash(seed))
    }

    next(): number {
        return this.rng()
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min
    }

    nextBool(): boolean {
        return this.next() < 0.5
    }

    fork(): RNG {
        return new DefaultRNG(this.seed + this.next())
    }

    private hash(str: string): number {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i)
            hash |= 0
        }
        return hash
    }
}

export function mulberry32(a: number): () => number {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}