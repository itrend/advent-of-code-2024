const IN_SMALL = "day23small.in"
const IN_BIG = "day23.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n").map(s => s.split("-"))
// const input = inputRaw.split("\n").map(s => s.split(""))

const g = new Map<string, Set<string>>()
const gadd = (a: string, b: string) => {
    const r = g.get(a) ?? new Set<string>()
    if (r.size === 0) g.set(a, r)
    r.add(b)
}

const gin = (a: string, b: string) => !!g.get(a)?.has(b)

for (const [a, b] of input) {
    gadd(a, b)
    gadd(b, a)
}


function part1() {
    const nl = [...g.keys()]
    nl.sort((a, b) => {
        const at = a.startsWith("t"), bt = b.startsWith("t")
        return at === bt ? 0 : (at ? -1: +1)
    })
    let r1 = 0
    for (let i=0; i<nl.length; ++i)
        if (nl[i].startsWith("t"))
            for (let j=i+1; j<nl.length; ++j)
                if (gin(nl[i], nl[j]))
                    for (let k=j+1; k<nl.length; ++k)
                        if (gin(nl[j], nl[k]) && gin(nl[k], nl[i])) r1++
    return r1
}


console.log("Part 1 =>", part1())
console.log("Nodes =", g.size)
const EMPTY = new Set<string>()


function part2() {
    const tmax = Math.max(...g.values().map(s => s.size))
    let best = EMPTY
    const toPassword = (s: Set<string>) => s.values().toArray().sort().join(",")
    const seen = new Set<string>()

    function dfs(c: Set<string>, f: Set<string>) {
        const cp = toPassword(c)
        if (seen.has(cp)) return
        seen.add(cp)
        if (f.size === 0) {
            if (c.size > best.size) {
                best = new Set(c)
                if (best.size === tmax) throw new Error("PASSWORD IS: " + toPassword(best))
            }
            return
        }
        // if (c.size <= 2) console.log("c#", c.size, "f#", f.size, "b#", best.size, c)
        for (const u of f) {
            const nf = f.intersection(g.get(u) ?? EMPTY)
            c.add(u)
            dfs(c, nf)
            c.delete(u)
        }
    }

    const c = new Set<string>()
    let n = 0
    for (const u of g.keys()) {
        // console.log(n++, u)
        c.add(u)
        dfs(c, g.get(u) ?? EMPTY)
        c.delete(u)
    }
    return toPassword(best)
}


function adjHist() {
    const hist = new Array<number>(14).fill(0)
    g.forEach(v => hist[v.size]++)
    return hist
}


adjHist().forEach((v, i) => console.log(i, "=>", v))
let t = new Date().getTime()
try {
    console.log("Part 2 =>", part2())
} finally {
    t = new Date().getTime() - t
    console.log("Time", t)
}