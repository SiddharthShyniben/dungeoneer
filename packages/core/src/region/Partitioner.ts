import type { RNG } from "../rng/RNG.ts";
import type { Region } from "./Region.ts";

export interface Partitioner {
    partition(region: Region, rng: RNG): Region[]
}