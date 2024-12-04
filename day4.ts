const IN = "day4.txt"
// const IN = "day4small.txt"
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n").map(s => s.split(""))

const xmas = ["X", "M", "A", "S"]
const DIR = []
for (let r = -1; r<2; ++r)
    for (let c = -1; c<2; ++c)
        if (r || c) DIR.push([r, c])


function dirMas(r: number, c: number, dr: number, dc: number): boolean {
    for (let i=0; i<xmas.length; ++i) {
        const rr = r + i * dr
        const cc = c + i * dc
        if (! (0 <= rr && rr < input.length && 0 <= cc && cc < input[rr].length && input[rr][cc] === xmas[i]))
            return false
    }
    return true
}


let r1 = 0
for (let r=0; r<input.length; ++r)
    for (let c=0; c<input[r].length; ++c)
        if (input[r][c] == "X")
            for (const [dr, dc] of DIR)
                r1 += +dirMas(r, c, dr, dc)
console.log("Part 1 =>", r1)


function crossMas(r: number, c: number): boolean {
    const ms = (dr: number, dc: number) => [input[r-dr][c-dc], input[r+dr][c+dc]].toSorted().join("") === "MS"
    return ms(1, 1) && ms(1, -1)
}

let r2 = 0
for (let r=1; r<input.length-1; ++r)
    for (let c=1; c<input[r].length; ++c)
        if (input[r][c] === "A")
            r2 += +crossMas(r, c)
console.log("Part 2 =>", r2)
