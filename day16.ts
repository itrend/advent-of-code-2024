const IN_SMALL = "day16small2.in"
const IN_BIG = "day16.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const grid = inputRaw.split("\n").map(s => s.split(""))

const INF = 1e20

const find = (needle: string) => grid.entries()
    .map(([r, row]) => [r, row.indexOf(needle)])
    .filter(([_, c]) => c >= 0)
    .toArray()[0] as [number, number]


const start = find("S")
const end = find("E")
grid[start[0]][start[1]] = '.'
grid[end[0]][end[1]] = '.'

const ckey = (r: number, c: number) => 1000*r + c

const dupGridF = <T>(f: () => T) => grid.map(row => row.map(f))
const dupGrid = <T>(v: T) => dupGridF(() => v)

const D = [[0,1], [-1,0], [0,-1], [1,0]]
function diDiff(di1: number, di2: number) {
    const diff = Math.abs(di1 - di2)
    return Math.min(diff, D.length - diff)
}

function part1(): number {
    const front = [start]
    const dist = dupGrid(INF)
    const dir = dupGrid(-1)
    dist[start[0]][start[1]] = 0
    dir[start[0]][start[1]] = 0
    while (front.length) {
        let minD = INF, mini = -1
        for (let i=0; i<front.length; ++i) {
            const [r, c] = front[i]
            if (dist[r][c] < minD) {
                minD = dist[r][c]
                mini = i
            }
        }
        const [minR, minC] = front[mini]
        front.splice(mini, 1)
        const pdi = dir[minR][minC]
        for (let di=0; di<D.length; ++di) {
            const r = minR+D[di][0], c = minC+D[di][1]
            const didiff = diDiff(pdi, di)
            const cost = 1 + 1000 * didiff
            if (grid[r][c] == '.' && dist[minR][minC] + cost <= dist[r][c]) {
                dist[r][c] = dist[minR][minC] + cost
                dir[r][c] = di
                front.push([r, c])
            }
        }
    }
    dist.forEach(row => console.log(row.map((v) => (v == INF ? "####" : v.toString()).padStart(5, " ")).join(" ")))
    return dist[end[0]][end[1]]
}


const bestCost = part1()
console.log("Part 1 =>", bestCost)


function part2() {
    // const vis = dupGrid([false, false, false, false])
    const dist = dupGridF(() => [INF, INF, INF, INF])
    const path: number[][] = []
    const allPaths = new Set<number>()

    function dfs(r: number, c: number, di: number, cost: number) {
        if (grid[r][c] == '#' || cost > bestCost || cost > dist[r][c][di]) return
        dist[r][c][di] = cost
        if (r === end[0] && c === end[1]) {
            if (cost === bestCost) {
                for (const [rr, cc] of path)
                    allPaths.add(ckey(rr, cc))
            }
            return
        }
        path.push([r, c])
        dfs(r + D[di][0], c + D[di][1], di, cost + 1)
        dfs(r, c, (di+1) % 4, cost + 1000)
        dfs(r, c, (di+3) % 4, cost + 1000)
        path.pop()
    }

    dfs(start[0], start[1], 0, 0)
    return allPaths.size
}


const ts = new Date().getTime()
console.log("Part 2 =>", 1 + part2())
const t = new Date().getTime() - ts
console.log("Time: ", t)
