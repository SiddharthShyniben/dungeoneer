import type { Chokepoint } from "./Chokepoint.ts"

export interface GraphEdge<E = never> {
  id: number
  from: number
  to: number
  cells: Set<number>
  chokepoints: Chokepoint<E>[]
  metadata?: E
}