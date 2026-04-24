import type { BaseTile } from "./BaseTile.ts";

export interface Cell<T = never> {
    base: BaseTile;
    tag?: T;
    owner?: number;
}