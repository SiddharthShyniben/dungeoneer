export interface ConnectionStrategy {
    connect(components: Set<number>[], gridWidth: number): Connection[]
}

export interface Connection {
    a: Set<number>
    b: Set<number>
    from: { x: number, y: number }
    to: { x: number, y: number }
}