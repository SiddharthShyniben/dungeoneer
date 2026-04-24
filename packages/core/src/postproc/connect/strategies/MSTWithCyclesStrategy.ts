import { closestPair } from "../graphing.ts";
import type { Connection, ConnectionStrategy } from "../ConnectionStrategy.ts";

export class MSTWithCyclesStrategy implements ConnectionStrategy {
    constructor(private readonly extraConnections: number = 2) {}

    connect(components: Set<number>[], gridWidth: number): Connection[] {
        if (components.length <= 1) return []

        const edges: { a: number, b: number, dist: number, from: {x:number,y:number}, to: {x:number,y:number} }[] = []
        for (let i = 0; i < components.length; i++) {
            for (let j = i + 1; j < components.length; j++) {
                const [from, to] = closestPair(gridWidth, components[i]!, components[j]!)
                const dist = Math.abs(from.x - to.x) + Math.abs(from.y - to.y)
                edges.push({ a: i, b: j, dist, from, to })
            }
        }

        edges.sort((a, b) => a.dist - b.dist)

        const parent = components.map((_, i) => i)
        const rank = new Array(components.length).fill(0)

        function find(i: number): number {
            if (parent[i] !== i) parent[i] = find(parent[i]!)
            return parent[i]!
        }

        function union(i: number, j: number): boolean {
            const ri = find(i), rj = find(j)
            if (ri === rj) return false
            if (rank[ri]! < rank[rj]!) parent[ri] = rj
            else if (rank[ri]! > rank[rj]!) parent[rj] = ri
            else { parent[rj] = ri; rank[ri]!++ }
            return true
        }

        const result: Connection[] = []
        const nonMSTEdges: typeof edges = []

        for (const edge of edges) {
            if (union(edge.a, edge.b)) {
                result.push({
                    a: components[edge.a]!,
                    b: components[edge.b]!,
                    from: edge.from,
                    to: edge.to
                })
            } else {
                nonMSTEdges.push(edge)
            }
        }

        for (let i = 0; i < Math.min(this.extraConnections, nonMSTEdges.length); i++) {
            const edge = nonMSTEdges[i]!
            result.push({
                a: components[edge.a]!,
                b: components[edge.b]!,
                from: edge.from,
                to: edge.to
            })
        }

        return result
    }
}