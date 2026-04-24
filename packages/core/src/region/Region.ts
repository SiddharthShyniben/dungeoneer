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

export function createRegion(mask: Uint8Array, width: number, height: number): Region {
    return {
        mask,
        bounds: computeBounds(mask, width, height)
    }
}

export function createRegionFrom2DArray(array: number[][]): Region {
    const height = array.length;
    const width = array[0]?.length || 0;

    const mask = new Uint8Array(width * height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            mask[y * width + x] = array[y]![x] ?? 0
        }
    }

    return createRegion(mask, width, height)
}

export function intersect(a: Region, b: Region): Region {
    const width = Math.min(a.bounds.x + a.bounds.width, b.bounds.x + b.bounds.width) - Math.max(a.bounds.x, b.bounds.x)
    const height = Math.min(a.bounds.y + a.bounds.height, b.bounds.y + b.bounds.height) - Math.max(a.bounds.y, b.bounds.y);

    if (width <= 0 || height <= 0) {
        return createRegion(new Uint8Array(0), 0, 0)
    }

    const mask = new Uint8Array(width * height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const ax = x + Math.max(a.bounds.x, b.bounds.x)
            const ay = y + Math.max(a.bounds.y, b.bounds.y)
            mask[y * width + x] = (a.mask[ay * a.bounds.width + ax] === 1 && b.mask[ay * b.bounds.width + ax] === 1) ? 1 : 0
        }
    }

    return createRegion(mask, width, height)
}

export function subtract(a: Region, b: Region): Region {
    const width = a.bounds.width
    const height = a.bounds.height
    const mask = new Uint8Array(width * height)

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const ax = x + a.bounds.x
            const ay = y + a.bounds.y
            const inA = a.mask[y * width + x] === 1
            const inB = (b.bounds.x <= ax && ax < b.bounds.x + b.bounds.width && b.bounds.y <= ay && ay < b.bounds.y + b.bounds.height) ? (b.mask[(ay - b.bounds.y) * b.bounds.width + (ax - b.bounds.x)] === 1) : false
            mask[y * width + x] = (inA && !inB) ? 1 : 0
        }
    }

    return createRegion(mask, width, height)
}

export function cellInRegion(region: Region, x: number, y: number): boolean {
    if (x < region.bounds.x || x >= region.bounds.x + region.bounds.width || y < region.bounds.y || y >= region.bounds.y + region.bounds.height) {
        return false
    }

    return region.mask[(y - region.bounds.y) * region.bounds.width + (x - region.bounds.x)] === 1
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

export function computeBounds(mask: Uint8Array, gridWidth: number, gridHeight: number): Bounds {
    let minX = gridWidth, maxX = 0, minY = gridHeight, maxY = 0
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (mask[y * gridWidth + x] === 1) {
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
            }
        }
    }
    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}