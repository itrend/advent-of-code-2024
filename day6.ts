const IN = "day6.in"
// const IN = "day6small.txt"
const inputRaw = Deno.readTextFileSync(IN)
const grid = inputRaw.split("\n").map(s => s.split(""))

const [[sr, sc]] = [...grid.entries()
    .map(([i, r]) => ([i, r.indexOf("^")]))
    .filter(([_, c]) => c >= 0)
    .take(1)]

const inGrid = (r: number, c: number) => 0 <= r && r < grid.length && 0 <= c && c < grid[r].length

const D = [[-1,0],[0,1],[1,0],[0,-1],]


function part1() {
    let r = sr, c = sc
    let di = 0
    const move = () => ([r + D[di][0], c + D[di][1]])
    let r1 = 0
    while (inGrid(r, c)) {
        if (".^".includes(grid[r][c])) {
            r1 += 1
            grid[r][c] = "X"
        }
        let [rr, cc] = move()
        while (inGrid(rr, cc) && grid[rr][cc] == '#') {
            di = (di + 1) % D.length
            ;[rr, cc] = move()
        }
        r = rr
        c = cc
    }
    return r1
}

// console.log("Part 1 =>", part1())


function isCycle() {
    const pairSet = new Set<string>()
    let pr = -1, pc = -1

    let r = sr, c = sc
    let di = 0
    const move = () => ([r + D[di][0], c + D[di][1]])
    while (inGrid(r, c)) {
        const pairKey = `${r}_${c}_${pr}_${pc}`
        if (pairSet.has(pairKey)) return true
        pairSet.add(pairKey)
        let [rr, cc] = move()
        while (inGrid(rr, cc) && grid[rr][cc] == '#') {
            di = (di + 1) % D.length
            ;[rr, cc] = move()
        }
        pr = r; pc = c;
        r = rr; c = cc;
    }
    return false
}

function obstacleCycle(r: number, c: number) {
    if (grid[r][c] !== '.') return false
    try {
        grid[r][c] = '#'
        return isCycle()
    } finally {
        grid[r][c] = '.'
    }
}

// console.log(obstacleCycle(6, 3))
const t = new Date()
let r2 = 0
for (let r=0; r<grid.length; ++r)
    for (let c=0; c<grid[r].length; ++c) {
        // console.log(r, c, obstacleCycle(r, c))
        r2 += +obstacleCycle(r, c)
    }
const te = new Date()
console.log("Part 2 =>", r2)
console.log("time", te.getTime() - t.getTime())
