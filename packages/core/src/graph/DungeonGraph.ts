import type { GraphEdge } from "./GraphEdge.js"
import type { GraphNode } from "./GraphNode.js"

export interface DungeonGraph<N = never, E = never> {
    nodes: Map<number, GraphNode<N>>
    edges: GraphEdge<E>[]
}