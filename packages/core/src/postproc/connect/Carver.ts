import type { Grid } from "../../grid/Grid.ts";
import type { RNG } from "../../index.ts";

export interface Carver {
    carve(grid: Grid, from: { x: number, y: number }, to: { x: number, y: number }, rng: RNG): void
}