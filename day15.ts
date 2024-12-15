const IN_SMALL = "day15small.in"
const IN_BIG = "day15.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const [inputGrid, inputDir] = inputRaw.split("\n\n")
const grid = inputGrid.split("\n").map(s => s.split(""))
const moves = inputDir.split("\n").join("")

type Coords = [number, number]

const moveMap: Record<string, Coords> = {
    "<": [0, -1],
    ">": [0, +1],
    "^": [-1, 0],
    "v": [+1, 0],
}

const findRobot = (grid: string[][]) => grid.entries()
    .map(([r, row]) => [r, row.indexOf("@")])
    .filter(([_, c]) => c >= 0)
    .toArray()[0] as Coords

function move1(p: Coords, mv: string, grid: string[][]): Coords {
    const [r, c] = p
    const [dr, dc] = moveMap[mv]
    let rr = r+dr, cc=c+dc
    while (grid[rr][cc] === 'O') {
        rr += dr
        cc += dc
    }
    if (grid[rr][cc] === '#') return p
    while (rr != r || cc != c) {
        grid[rr][cc] = grid[rr-dr][cc-dc]
        rr -= dr
        cc -= dc
    }
    return [r+dr, c+dc]
}

function printGrid(grid: string[][], p?: number[]) {
    let saveP = "."
    if (p) { saveP = grid[p[0]][p[1]]; grid[p[0]][p[1]] = "@" }
    grid.forEach((row) => console.log(row.join("")))
    if (p) { grid[p[0]][p[1]] = saveP }
}

function solve(grid: string[][], crate: string,  move: (p: Coords, mv: string, grid: string[][]) => Coords) {
    let p = findRobot(grid)
    grid[p[0]][p[1]] = "."
    for (const mv of moves) {
        p = move(p, mv, grid)
        // console.log("!!!", mv)
        // printGrid(grid, p)
    }
    let r1 = 0
    for (let r=0; r<grid.length; ++r)
        for (let c=0; c<grid[r].length; ++c)
            if (grid[r][c] == crate) r1 += 100*r + c
    return r1
}

// console.log("Part 1 =>", solve(grid, "O", move1)); throw Error()

const ggMap: Record<string, string> = {"#": "##", "O": "[]", ".": "..", "@": "@."}
const grid2 = grid.map((row) => row.flatMap((v) => ggMap[v].split("")))
printGrid(grid2)

function move2(p: Coords, mv: string, grid: string[][]): Coords {
    const [r, c] = p
    const [dr, dc] = moveMap[mv]
    let rr = r+dr, cc=c+dc
    if ("<>".includes(mv)) {
        while ("[]".includes(grid[rr][cc])) {
            rr += dr
            cc += dc
        }
        if (grid[rr][cc] === '#') return p
        while (rr != r || cc != c) {
            grid[rr][cc] = grid[rr-dr][cc-dc]
            rr -= dr
            cc -= dc
        }
        return [r+dr, c+dc]
    }

    const front = [[[r, c]]]

    for (;;) {
        let allEmpty = true
        let anyWall = false
        let nf: number[][] = []

        const pushnf = (rr: number, cc: number) => {
            for (const [rrr, ccc] of nf)
                if (rrr === rr && ccc == cc) return
            nf.push([rr, cc])
        }

        for (const [fr, cc] of front[front.length-1]) {
            const rr = fr + dr
            const ch = grid[rr][cc]
            anyWall ||= ch === '#'
            allEmpty &&= ch === "."
            if (ch === "]") { pushnf(rr, cc-1); pushnf(rr, cc); }
            if (ch === "[") { pushnf(rr, cc); pushnf(rr, cc+1); }
        }

        if (anyWall) return p
        if (front.length > 1 && allEmpty) break
        front.push(nf)
        nf = []
    }

    for (let i=front.length-1; i>=1; i--) {
        for (const [rr, cc] of front[i]) {
            grid[rr+dr][cc] = grid[rr][cc]
            grid[rr][cc] = '.'
        }
    }
    return [r+dr, c+dc]
}


const r2 = solve(grid2, "[", move2)
console.log("Part 2 =>", r2)
