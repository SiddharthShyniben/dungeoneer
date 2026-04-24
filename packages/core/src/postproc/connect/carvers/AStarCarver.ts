import { BaseTile } from "../../../grid/BaseTile.ts";
import type { Grid } from "../../../grid/Grid.ts";
import type { RNG } from "../../../rng/RNG.ts";
import type { Carver } from "../Carver.ts";

interface Node {
    x: number
    y: number
    g: number
    f: number
    parent: Node | null
}

export class AStarCarver implements Carver {
    constructor(
        private readonly floorCost: number = 1,   // low = prefers existing floor
        private readonly wallCost: number = 10,    // high = avoids carving new cells
    ) {}

    carve(grid: Grid, from: { x: number, y: number }, to: { x: number, y: number }, rng: RNG): void {
        const path = this.astar(grid, from, to)
        if (path === null) return  // no path found — shouldn't happen on a bounded grid
        for (const { x, y } of path) {
            grid.set(x, y, { base: BaseTile.Floor })
        }
    }

    private astar(
        grid: Grid,
        from: { x: number, y: number },
        to: { x: number, y: number }
    ): { x: number, y: number }[] | null {
        const key = (x: number, y: number) => y * grid.width + x

        const open = new Map<number, Node>()
        const closed = new Set<number>()

        const startNode: Node = {
            x: from.x, y: from.y,
            g: 0,
            f: this.heuristic(from, to),
            parent: null
        }
        open.set(key(from.x, from.y), startNode)

        while (open.size > 0) {
            // get lowest f node
            let current: Node | null = null
            for (const node of open.values()) {
                if (current === null || node.f < current.f) current = node
            }
            if (current === null) break

            if (current.x === to.x && current.y === to.y) {
                return this.reconstructPath(current)
            }

            open.delete(key(current.x, current.y))
            closed.add(key(current.x, current.y))

            for (const [nx, ny] of this.neighbors(grid, current.x, current.y)) {
                if (closed.has(key(nx, ny))) continue

                const cell = grid.get(nx, ny)
                const stepCost = cell?.base === BaseTile.Floor ? this.floorCost : this.wallCost
                const g = current.g + stepCost
                const f = g + this.heuristic({ x: nx, y: ny }, to)

                const existing = open.get(key(nx, ny))
                if (existing === undefined || g < existing.g) {
                    open.set(key(nx, ny), { x: nx, y: ny, g, f, parent: current })
                }
            }
        }

        return null
    }

    private heuristic(a: { x: number, y: number }, b: { x: number, y: number }): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }

    private neighbors(grid: Grid, x: number, y: number): [number, number][] {
        return ([
            [x + 1, y], [x - 1, y],
            [x, y + 1], [x, y - 1]
        ] as [number, number][]).filter(([nx, ny]) => grid.inBounds(nx, ny))
    }

    private reconstructPath(node: Node): { x: number, y: number }[] {
        const path: { x: number, y: number }[] = []
        let cur: Node | null = node
        while (cur !== null) {
            path.push({ x: cur.x, y: cur.y })
            cur = cur.parent
        }
        return path.reverse()
    }
}