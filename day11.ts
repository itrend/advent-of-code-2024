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
    if (ss.length % 2 == 0) return [parseInt(ss.substring(0, hl)), parseInt(ss.substring(hl))]
    return [s*2024]
}


function blink(stones: number[]) {
    const r: number[] = []
    for (const s of stones) {
        r.splice(r.length, 0, ...mapStone(s))
    }
    return r
}


type Stones2 = Map<number, number>


function blink2(stones: Stones2): Stones2 {
    const r: Stones2 = new Map()
    stones.entries().forEach(([stone, count]) => {
        for (const ns of mapStone(stone)) {
            const c = r.get(ns)
            r.set(ns, (c ?? 0) + count)
        }
    })
    return r
}


// let r1 = stones
// for (let i=0; i<25; ++i) {
//     console.log(i, "=>", r1.length)
//     r1 = blink(r1)
// }
// console.log("Part 1 =>", r1.length)


let r2: Stones2 = new Map()
for (const s of stones) r2.set(s, 1)
for (let i=0; i<75; ++i) {
    console.log(i, "=>", r2.size)
    r2 = blink2(r2)
}
console.log("Part 2 =>", r2.values().reduce((s, a) => s + a, 0))
