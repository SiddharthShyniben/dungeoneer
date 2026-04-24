export interface RNG {
    next(): number
    nextInt(min: number, max: number): number
    fork(): RNG
}