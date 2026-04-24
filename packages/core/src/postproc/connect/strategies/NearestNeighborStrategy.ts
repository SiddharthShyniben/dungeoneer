import { closestPair } from "../graphing.ts";
import type { Connection, ConnectionStrategy } from "../ConnectionStrategy.ts";

export class NearestNeighborStrategy implements ConnectionStrategy {
    connect(components: Set<number>[], gridWidth: number): Connection[] {
        if (components.length <= 1) return []

        const connected = new Set<number>([0])
        const result: Connection[] = []

        // grow connected set by always grabbing the nearest unconnected component
        while (connected.size < components.length) {
            let bestDist = Infinity
            let bestFrom = { x: 0, y: 0 }
            let bestTo = { x: 0, y: 0 }
            let bestJ = -1

            for (const i of connected) {
                for (let j = 0; j < components.length; j++) {
                    if (connected.has(j)) continue
                    const [from, to] = closestPair(gridWidth, components[i]!, components[j]!)
                    const dist = Math.abs(from.x - to.x) + Math.abs(from.y - to.y)
                    if (dist < bestDist) {
                        bestDist = dist
                        bestFrom = from
                        bestTo = to
                        bestJ = j
                    }
                }
            }

            if (bestJ === -1) break

            connected.add(bestJ)
            result.push({
                a: components[0]!,  // source component (arbitrary, carver only needs points)
                b: components[bestJ]!,
                from: bestFrom,
                to: bestTo
            })
        }

        return result
    }
}