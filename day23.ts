import { timeIt } from "./time.ts";

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

for (const [a, b] of input) {
    gadd(a, b)
    gadd(b, a)
}


function part1() {
    const nl = [...g.keys()]
    const gin = (a: string, b: string) => !!g.get(a)?.has(b)
    nl.sort((a, b) => +b.startsWith("t") - +a.startsWith("t"))
    let r1 = 0
    for (let i=0; i<nl.length; ++i)
        if (nl[i].startsWith("t"))
            for (let j=i+1; j<nl.length; ++j)
                if (gin(nl[i], nl[j]))
                    for (let k=j+1; k<nl.length; ++k)
                        if (gin(nl[j], nl[k]) && gin(nl[k], nl[i])) r1++
    return r1
}


console.log("Part 1 =>", timeIt(part1))
console.log("Nodes =", g.size)
const tmax = Math.max(...g.values().map(s => s.size))
console.log("tmax =", tmax)


function part2() {
    const cur: string[] = []
    const best: string[] = []

    function dfs(u: string, f: Set<string>) {
        cur.push(u)
        if (cur.length > best.length)
            best.splice(0, best.length, ...cur)
        for (const v of f)
            if (v > u)
                dfs(v, f.intersection(g.get(v)!))
        cur.pop()
    }

    g.forEach((adj, u) => dfs(u, adj))
    return best.join(",")
}


function adjHist() {
    const hist = new Array<number>(14).fill(0)
    g.forEach(v => hist[v.size]++)
    return hist
}


adjHist().forEach((v, i) => { if (v > 0) console.log("H", i, "=>", v) })
const r2 = timeIt(part2)
console.log("Part 2 =>", r2)
