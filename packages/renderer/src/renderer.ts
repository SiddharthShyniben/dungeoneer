import chalk from "chalk";
import { BaseTile } from "@dungeoneer/core";
import type { Grid } from "@dungeoneer/core";

const FLOOR_COLOR = { r: 180, g: 140, b: 100 };
const WALL_COLOR  = { r: 30,  g: 20,  b: 10  };

function tileColor(grid: Grid, x: number, y: number) {
    const cell = grid.get(x, y);
    return cell?.base === BaseTile.Floor ? FLOOR_COLOR : WALL_COLOR;
}

export function render(grid: Grid): void {
    const rows: string[] = [];

    for (let y = 0; y < grid.height; y += 2) {
        let row = "";
        for (let x = 0; x < grid.width; x++) {
            const top    = tileColor(grid, x, y);
            const bottom = y + 1 < grid.height ? tileColor(grid, x, y + 1) : WALL_COLOR;

            row += chalk
                .rgb(top.r, top.g, top.b)
                .bgRgb(bottom.r, bottom.g, bottom.b)("▀");
        }
        rows.push(row);
    }

    console.log(rows.join("\n"));
}