import { parse, D4 } from "./grid.ts"

const IN_SMALL = "day20small.in"
const IN_BIG = "day20.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)

const grid = parse(inputRaw)
const INF = 1e20
const start = grid.findFirstGrid("S")!
const end = grid.findFirstGrid("E")!


function allDists() {
    const dist = grid.dupShape(INF)
    let front = [[start[0], start[1]]]
    dist[start[0]][start[1]] = 0
    while (front.length) {
        const nf: typeof front = []
        for (const [r, c] of front) {
            for (const [dr, dc] of D4) {
                const rr = r+dr, cc = c+dc
                if (grid[rr][cc] !== '#' && dist[rr][cc] > dist[r][c] + 1) {
                    dist[rr][cc] = dist[r][c] + 1
                    nf.push([rr, cc])
                }
            }
        }
        front = nf
    }
    return dist
}


const dist = allDists()


function countAbove(counts: Map<number, number>, threshold=100) {
    const cheats = counts.entries().toArray().toSorted((a, b) => a[0] - b[0])
    const above = cheats.filter(([p,]) => p >= threshold)
    // above.forEach(([p, n]) => console.log(`${n} cheats saving ${p}`))
    return above.reduce((s, [, n]) => s+n, 0)

}


function countCheats(cheatTime: number) {
    const counts = new Map<number, number>()
    grid.forEachGrid((v, r, c) => {
        if (dist[r][c] < INF) {
            for (let dr=-cheatTime; dr<=cheatTime; ++dr) {
                // const drc = C - Math.abs(dr)
                for (let dc=-cheatTime; dc<=cheatTime; ++dc) {
                    const rr = r + dr, cc = c + dc
                    const rd = Math.abs(dr) + Math.abs(dc)
                    const nd = dist[r][c] + rd
                    if (rd <= cheatTime && grid.isIn(rr, cc) && dist[rr][cc] < INF && dist[rr][cc] > nd) {
                        const cheatDist = dist[rr][cc] - nd
                        counts.set(cheatDist, 1 + (counts.get(cheatDist) ?? 0))
                    }
                }
            }
        }
    })
    return counts
}


const part1 = () => countAbove(countCheats(2))
console.log(part1())


const part2 = () => countAbove(countCheats(20))
console.log(part2())
