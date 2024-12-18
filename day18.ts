const IN_SMALL = "day18small.in"
const IN_BIG = "day18.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n").map(s => s.split(',').map((v) => parseInt(v)))
const bytes = input.map(([x, y]) => [y, x])

const R = Math.max(...bytes.map(([r]) => r)) < 10 ? 7 : 71
const C = R
const MaxBytes = R < 10 ? 12 : 1024

const inGrid = (r: number, c: number) => 0 <= r && r < R && 0 <= c && c < C
const ckey = (r: number, c: number) => 1000 * r + c


function getByteSet(maxBytes = MaxBytes): Set<number> {
    return new Set(bytes.slice(0, maxBytes).map(([r, c]) => ckey(r, c)))
}

function makeGrid<T>(r: number, c: number, v: T) {
    return new Array(r).fill(0).map(() => new Array(c).fill(v))
}

const INF = 1e20
const D = [[-1,0],[0,1],[1,0],[0,-1],]

function part1(bytes = getByteSet(MaxBytes)) {
    const dist = makeGrid(R, C, INF)

    function dfs(r: number, c: number, d: number) {
        d++
        if (!inGrid(r, c) || bytes.has(ckey(r, c)) || dist[r][c] <= d) return
        dist[r][c] = d
        for (const [dr, dc] of D) {
            dfs(r+dr, c+dc, d)
        }
    }

    function bfs() {
        let front = [[0, 0]]
        dist[0][0] = 0
        while (front.length) {
            const newFront: typeof front = []
            for (const [r, c] of front) {
                // console.log(r, c)
                for (const [dr, dc] of D) {
                    const rr = r+dr, cc = c+dc
                    if (inGrid(rr, cc) && !bytes.has(ckey(rr, cc)) && dist[rr][cc] > dist[r][c] + 1) {
                        newFront.push([rr, cc])
                        dist[rr][cc] = dist[r][c] + 1
                    }
                }
            }
            front = newFront
        }
    }

    bfs()
    // dfs(0, 0, -1)

    return dist[R-1][C-1]
}

console.log("Part 1 =>", part1())

function part2(): [number, number] {
    const byteSet = getByteSet(MaxBytes)
    for (let i=MaxBytes+1; i<bytes.length; ++i) {
        console.log(i)
        byteSet.add(ckey(bytes[i][0], bytes[i][1]))
        if (part1(byteSet) === INF) return [bytes[i][1], bytes[i][0]]
    }
    return [-1, -1]
}

let t = new Date().getTime()
console.log("Part 2 =>", part2().join())
t = new Date().getTime() - t
console.log("Time", t)