const IN_SMALL = "day10small.in"
const IN_BIG = "day10.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const grid = inputRaw.split("\n").map(s => s.split("").map((v) => parseInt(v)))

const inGrid = (r: number, c: number) => 0 <= r && r < grid.length && 0 <= c && c < grid[r].length

const D = [[-1,0], [1,0], [0,1], [0,-1]]

function part1() {
    function f(r: number, c: number, w: number, es: Set<number>): number {
        if (w === 10) {
            const pk = r*10000 + c
            if (es.has(pk)) return 0
            es.add(pk)
            return 1
        }
        return D
            .map(([dr, dc]) => ([r+dr, c+dc]))
            .filter(([rr, cc]) => inGrid(rr, cc) && grid[rr][cc] === w)
            .map(([rr, cc]) => f(rr, cc, w+1, es))
            .reduce((s, a) => s + a, 0)
    }

    let r1 = 0
    for (let r=0; r<grid.length; ++r)
        for (let c=0; c<grid[r].length; ++c)
            if (grid[r][c] === 0)
                r1 += f(r, c, 1, new Set())
    return r1
}

console.log("Part 1 =>", part1())

function part2() {
    const f = (r: number, c: number, w: number): number =>
        w === 10 ? 1 : D
            .map(([dr, dc]) => ([r+dr, c+dc]))
            .filter(([rr, cc]) => inGrid(rr, cc) && grid[rr][cc] === w)
            .map(([rr, cc]) => f(rr, cc, w+1))
            .reduce((s, a) => s + a, 0)

    let r2 = 0
    for (let r=0; r<grid.length; ++r)
        for (let c=0; c<grid[r].length; ++c)
            r2 += +(grid[r][c] === 0) && f(r, c, 1)
    return r2
}

console.log("Part 2 =>", part2())
