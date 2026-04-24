export type Region = {
    mask: Uint8Array
    bounds: Bounds
}

export type Bounds = {
    x: number
    y: number
    width: number
    height: number
}

export function createRegion(mask: Uint8Array, width: number, height: number, x: number = 0, y: number = 0): Region {
    return {
        mask,
        bounds: { x, y, width, height }
    }
}

export function createRegionFrom2DArray(array: number[][], x: number = 0, y: number = 0): Region {
    const height = array.length
    const width = array[0]?.length || 0
    const mask = new Uint8Array(width * height)
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            mask[row * width + col] = array[row]![col] ?? 0
        }
    }
    return createRegion(mask, width, height, x, y)
}

export function intersect(a: Region, b: Region): Region {
    const startX = Math.max(a.bounds.x, b.bounds.x)
    const startY = Math.max(a.bounds.y, b.bounds.y)
    const endX = Math.min(a.bounds.x + a.bounds.width, b.bounds.x + b.bounds.width)
    const endY = Math.min(a.bounds.y + a.bounds.height, b.bounds.y + b.bounds.height)
    const width = endX - startX
    const height = endY - startY
    if (width <= 0 || height <= 0) {
        return createRegion(new Uint8Array(0), 0, 0)
    }
    const mask = new Uint8Array(width * height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const globalX = x + startX
            const globalY = y + startY
            const aIdx = (globalY - a.bounds.y) * a.bounds.width + (globalX - a.bounds.x)
            const bIdx = (globalY - b.bounds.y) * b.bounds.width + (globalX - b.bounds.x)
            mask[y * width + x] = (a.mask[aIdx] === 1 && b.mask[bIdx] === 1) ? 1 : 0
        }
    }
    return createRegion(mask, width, height, startX, startY)
}

export function subtract(a: Region, b: Region): Region {
    const mask = new Uint8Array(a.mask.length)
    for (let y = 0; y < a.bounds.height; y++) {
        for (let x = 0; x < a.bounds.width; x++) {
            const inA = a.mask[y * a.bounds.width + x] === 1
            const globalX = x + a.bounds.x
            const globalY = y + a.bounds.y
            mask[y * a.bounds.width + x] = (inA && !cellInRegion(b, globalX, globalY)) ? 1 : 0
        }
    }
    return createRegion(mask, a.bounds.width, a.bounds.height, a.bounds.x, a.bounds.y)
}

export function cellInRegion(region: Region, x: number, y: number): boolean {
    const localX = x - region.bounds.x
    const localY = y - region.bounds.y
    if (localX < 0 || localX >= region.bounds.width || localY < 0 || localY >= region.bounds.height) {
        return false
    }
    return region.mask[localY * region.bounds.width + localX] === 1
}

export function getCellsInRegion(region: Region): { x: number, y: number }[] {
    const cells: { x: number, y: number }[] = []
    for (let y = 0; y < region.bounds.height; y++) {
        for (let x = 0; x < region.bounds.width; x++) {
            if (region.mask[y * region.bounds.width + x] === 1) {
                cells.push({ x: x + region.bounds.x, y: y + region.bounds.y })
            }
        }
    }
    return cells
}