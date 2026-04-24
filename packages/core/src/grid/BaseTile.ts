export const BaseTile = {
    Void: 0,
    Floor: 1,
    Wall: 2,
} as const;

export type BaseTile = typeof BaseTile[keyof typeof BaseTile]