import type { Cell } from "./Cell.ts";

export class Grid<T = never> {
    private cells: Cell<T>[][]

    constructor(public width: number, public height: number) {}

    get(x: number, y: number): Cell<T> | undefined {
        throw new Error("Not implemented");
    }

    set(x: number, y: number, cell: Cell<T>): void {
        throw new Error("Not implemented");
    }

    inBounds(x: number, y: number): boolean {
        throw new Error("Not implemented");
    }
}