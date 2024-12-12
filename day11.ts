const IN_SMALL = "day11small.in"
const IN_BIG = "day11.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const stones = inputRaw.trim().split(" ").map((v) => parseInt(v))


function mapStone(s: number): number[] {
    if (s === 0) return [1]
    const ss = s.toString()
    const hl = ss.length / 2
    if (ss.length % 2 == 0)
        return [parseInt(ss.substring(0, hl)), parseInt(ss.substring(hl))]
    return [s*2024]
}


function blink(stones: number[]) {
    return stones.flatMap(mapStone)
}


let r1 = stones
for (let i=0; i<25; ++i)
    r1 = blink(r1)
console.log("Part 1 =>", r1.length)


type Stones2 = Map<number, number>


function blink2(stones: Stones2): Stones2 {
    const r: Stones2 = new Map()
    stones.forEach((count, stone) =>
        mapStone(stone).forEach(ns =>
            r.set(ns, (r.get(ns) ?? 0) + count)))
    return r
}


let r2: Stones2 = new Map()
for (const s of stones) r2.set(s, 1 + (r2.get(s) ?? 0))
for (let i=0; i<75; ++i)
    r2 = blink2(r2)
console.log("Part 2 =>", r2.values().reduce((s, a) => s + a, 0))
