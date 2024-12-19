const IN_SMALL = "day19small.in"
const IN_BIG = "day19.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n\n")
const bases = input[0].split(", ")
const patterns = input[1].split("\n")
// const input = inputRaw.split("\n").map(s => s.split(""))

const baseSet = new Set(bases)
const maxBaseLen = Math.max(...bases.map(s => s.length))

function part1() {
    const cache = new Set<number>()

    function isPossible(p: string, i: number) {
        if (i >= p.length) return true
        if (cache.has(i)) return false
        for (let j=1; j<=maxBaseLen && i + j <= p.length; ++j) {
            if (baseSet.has(p.substring(i, i+j)) && isPossible(p, i+j)) return true
        }
        cache.add(i)
        return false
    }
    return patterns.reduce((s, p, i) => {
        console.log(i)
        cache.clear()
        return s + +isPossible(p, 0)
    }, 0)
}

console.log("Bases", bases.length)
console.log("Part 1 =>", part1())

function part2() {
    const cache = new Map<number, number>()

    function numPossible(p: string, i: number) {
        if (i >= p.length) return 1
        const cached = cache.get(i)
        if (cached != null) return cached

        let s = 0
        for (let j=1; j<=maxBaseLen && i + j <= p.length; ++j) {
            if (baseSet.has(p.substring(i, i+j))) s += numPossible(p, i+j)
        }
        cache.set(i, s)
        return s
    }
    return patterns.reduce((s, p, i) => {
        cache.clear()
        const np = numPossible(p, 0)
        console.log(i, p, np)
        return s + np
    }, 0)
}

console.log("Part 2 =>", part2())
