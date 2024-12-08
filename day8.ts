const IN_SMALL = "day8small.in"
const IN_BIG = "day8.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const grid = inputRaw.split("\n").map(s => s.split(""))

const allAnts = new Map<string, [number, number][]>()
for (let r=0; r<grid.length; ++r)
    for (let c=0; c<grid[r].length; ++c)
        if (grid[r][c] !== '.') {
            let ants = allAnts.get(grid[r][c])
            if (!ants) allAnts.set(grid[r][c], ants = [])
            ants.push([r, c])
        }

const inGrid = (r: number, c: number) => 0 <= r && r < grid.length && 0 <= c && c < grid[r].length

const antiSet = new Set<string>()
const addAnti = (r: number, c: number) => {
    if (inGrid(r, c))
        antiSet.add(`${r}-${c}`)
}

function part1() {
    allAnts.forEach((ants) => {
        for (let i=0; i<ants.length; ++i)
            for (let j=i+1; j<ants.length; ++j) {
                const dr = ants[j][0] - ants[i][0]
                const dc = ants[j][1] - ants[i][1]
                addAnti(ants[j][0] + dr, ants[j][1] + dc)
                addAnti(ants[i][0] - dr, ants[i][1] - dc)
            }
    })
    return antiSet.size
}

console.log("Part 1 =>", part1())

function part2() {
    allAnts.forEach((ants) => {
        for (let i=0; i<ants.length; ++i)
            for (let j=i+1; j<ants.length; ++j) {
                const dr = ants[j][0] - ants[i][0]
                const dc = ants[j][1] - ants[i][1]
                const dir = (rr: number, cc: number, dr: number, dc: number) => {
                    for (let r=rr, c=cc; inGrid(r, c); r += dr, c += dc)
                        addAnti(r, c)
                }
                dir(ants[j][0], ants[j][1], dr, dc)
                dir(ants[i][0], ants[i][1], -dr, -dc)
            }
    })
    return antiSet.size
}

console.log("Part 2 =>", part2())
