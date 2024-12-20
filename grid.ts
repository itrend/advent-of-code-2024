
export interface IGrid<T> {
    isIn(r: number, c: number): boolean
    forEachGrid(f: GridFunc<T, void>): void
    mapGrid<U>(f: GridFunc<T, U>): Grid<U>
    dupShape<U>(v: U | GridFunc<T, U>): Grid<U>
    coordKey(r: number, c: number): number
    findGrid(v: T): [number, number][]
    findFirstGrid(v: T): [number, number] | undefined
}

export type Grid<T> = Array<T[]> & IGrid<T>

export type GridFunc<T, U> = (v: T, r: number, c: number, g: Grid<T>) => U

export function newGrid<T>(g: T[][]): Grid<T> {
    const ga = g as any

    ga.isIn = function isIn(r: number, c: number): boolean {
        return 0 <= r && r < g.length && 0 <= c && c < g[r].length
    }

    ga.forEachGrid = function forEachGrid(f: GridFunc<T, void>) {
        for (let r=0; r<g.length; ++r)
            for (let c=0; c<g[r].length; ++c)
                f(g[r][c], r, c, ga)
    }

    ga.mapGrid = function mapGrid<U>(f: GridFunc<T, U>): Grid<U> {
        return newGrid(g.map((row, r) => row.map((v, c) => f(v, r, c, ga))))
    }

    ga.dupShape = function dupShape<U>(v: U | GridFunc<T, U>): Grid<U> {
        return typeof v === "function" ? ga.mapGrid(v) : ga.mapGrid(() => v)
    }

    ga.coordKey = function coordKey(r: number, c: number): number {
        return g[0].length * r + c
    }

    ga.findGrid = (needle: T) => g.entries()
            .map(([r, row]) => [r, row.indexOf(needle)])
            .filter(([_, c]) => c >= 0)
            .toArray() as [number, number][]

    ga.findFirstGrid = (needle: T) => ga.findGrid(needle)[0]

    return ga
}

export function parse(s: string): Grid<string> {
    return newGrid(s.trimEnd().split("\n").map(line => line.split("")))
}

export const D4 = [[0,1], [-1,0], [0,-1], [1,0]]

// const g = newGrid([[1,2,3], [4,5,6]])
// console.log(g[0], g.length, g)
// for (const row of g) {
//     console.log(row)
// }
// const u = g.map((v) => v.toString())
// console.log(u)
