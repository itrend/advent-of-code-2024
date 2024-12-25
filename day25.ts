const IN_SMALL = "day25small.in"
const IN_BIG = "day25.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)

function parseKey(s: string) {
    const grid = s.split("\n").map((r) => r.split(""))
    const isLock = grid[0].every((v) => v === '#')
    if (!isLock) {
        for (let i=0; i<grid.length/2; ++i) {
            const j = grid.length-i-1
            const t = grid[i]
            grid[i] = grid[j]
            grid[j] = t
        }
    }
    const h = new Array<number>(grid[0].length)
    for (let r=0; r<grid.length; ++r)
        for (let c=0; c<grid[r].length; ++c)
            if (grid[r][c] === '#')
                h[c] = r
    return { isLock, h }
}

const input = inputRaw.split("\n\n").map(parseKey)
const keys = input.filter(({ isLock }) => !isLock).map(({ h }) => h)
const locks = input.filter(({ isLock }) => isLock).map(({ h }) => h)

function part1() {
    let r = 0

    const poss = (a: number[], b: number[]) => {
        for (let i=0; i<a.length; ++i)
            if (a[i] + b[i] > 5) return false
        return true
    }

    for (const key of keys) 
        for (const lock of locks)
            r += +poss(key, lock)
    return r
}


console.log("Part 1 =>", part1())
