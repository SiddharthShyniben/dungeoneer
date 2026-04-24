export interface Chokepoint<E = never> {
  at: { x: number, y: number }
  metadata?: E
}