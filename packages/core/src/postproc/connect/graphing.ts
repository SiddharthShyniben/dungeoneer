import type { Grid } from "../../grid/Grid.ts"
import { BaseTile, cellInRegion, getCellsInRegion, type Region } from "../../index.ts"

export function findComponents(grid: Grid, region: Region): Set<number>[] {
    const visited = new Uint8Array(grid.width * grid.height)
    const components: Set<number>[] = []

    for (const { x, y } of getCellsInRegion(region)) {
        const idx = y * grid.width + x
        if (visited[idx] || grid.get(x, y)?.base !== BaseTile.Floor) continue

        const component = new Set<number>()
        const queue = [idx]

        while (queue.length > 0) {
            const curr = queue.pop()!
            if (visited[curr]) continue
            visited[curr] = 1
            component.add(curr)

            const cx = curr % grid.width
            const cy = Math.floor(curr / grid.width)

            for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
                const nidx = ny! * grid.width + nx!
                if (
                    grid.inBounds(nx!, ny!) &&
                    cellInRegion(region, nx!, ny!) &&
                    !visited[nidx] &&
                    grid.get(nx!, ny!)?.base === BaseTile.Floor
                ) {
                    queue.push(nidx)
                }
            }
        }

        components.push(component)
    }

    return components
}

export function closestPair(
    gridWidth: number,
    a: Set<number>,
    b: Set<number>
): [{ x: number, y: number }, { x: number, y: number }] {
    let bestDist = Infinity
    let bestA = { x: 0, y: 0 }
    let bestB = { x: 0, y: 0 }

    for (const idxA of a) {
        const ax = idxA % gridWidth
        const ay = Math.floor(idxA / gridWidth)
        for (const idxB of b) {
            const bx = idxB % gridWidth
            const by = Math.floor(idxB / gridWidth)
            const dist = Math.abs(ax - bx) + Math.abs(ay - by)
            if (dist < bestDist) {
                bestDist = dist
                bestA = { x: ax, y: ay }
                bestB = { x: bx, y: by }
            }
        }
    }

    return [bestA, bestB]
}