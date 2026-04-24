import { BaseTile } from "./BaseTile.js";
import type { Cell } from "./Cell.ts";

export class Grid<T = never> {
    private cells: Cell<T>[][] = [];

    constructor(public width: number, public height: number) {
        this.initializeCells();
    }

    get(x: number, y: number): Cell<T> | undefined {
        if (!this.inBounds(x, y)) {
            return undefined;
        }

        return this.cells[y]![x];
    }

    set(x: number, y: number, cell: Cell<T>): void {
        if (!this.inBounds(x, y)) {
            throw new Error("Coordinates out of bounds");
        }

        this.cells[y]![x] = cell;
    }

    inBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    private initializeCells(): void {
        for (let y = 0; y < this.height; y++) {
            const row: Cell<T>[] = [];
            for (let x = 0; x < this.width; x++) {
                row.push({base: BaseTile.Void});
            }
            this.cells.push(row);
        }
    }
}