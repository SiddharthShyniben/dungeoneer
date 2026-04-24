export interface GraphNode<N = never> {
    id: number
    centroid: { x: number, y: number }
    metadata?: N
}