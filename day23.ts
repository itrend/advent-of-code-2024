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


console.log("Part 1 =>", part1())
console.log("Nodes =", g.size)
const tmax = Math.max(...g.values().map(s => s.size))
console.log("tmax =", tmax)


function part2() {
    const EMPTY = new Set<string>()
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
    for (const u of g.keys()) {
        c.add(u)
        dfs(c, g.get(u) ?? EMPTY)
        c.delete(u)
    }
    return toPassword(best)
}


function part2Num() {
    const EMPTY = new Set<number>()
    const nodes = [...g.keys()].sort()
    const nodeMap = Object.fromEntries(nodes.map((v, i) => [v, i]))
    const gn = nodes.map((name) => new Set(g.get(name)!.values().map(v => nodeMap[v])))
    let best = EMPTY

    const toPassword = (s: Set<number>) => s.values().map((v) => nodes[v]).toArray().sort().join(",")

    function dfs(u: number, c: Set<number>, f: Set<number>) {
        c.add(u)
        if (c.size > best.size) {
            best = new Set(c)
            // if (best.size === tmax) throw new Error("PASSWORD IS: " + toPassword(best))
        }
        for (const v of f)
            if (v > u)
                dfs(v, c, f.intersection(gn[u]) ?? EMPTY)
        c.delete(u)
    }

    const c = new Set<number>()
    for (let u=0; u<gn.length; ++u) {
        dfs(u, c, gn[u])
    }
    return toPassword(best)
}


function adjHist() {
    const hist = new Array<number>(14).fill(0)
    g.forEach(v => hist[v.size]++)
    return hist
}


adjHist().forEach((v, i) => { if (v > 0) console.log("H", i, "=>", v) })
const r2 = timeIt(() => part2())
console.log("Part 2 =>", r2)
