const IN_SMALL = "day13small.in"
const IN_BIG = "day13.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw
    .split("\n")
    .filter((s) => s.trim().length > 0)
    .map(s => s.split(/,/).map((p) => p.match(/(\d+)/)?.[1] ?? "-1").map((v) => parseInt(v)))
// const input = inputRaw.split("\n").map(s => s.split(""))

type Pair = number[]
const INF = 1e14

function winCost(a: Pair, b: Pair, target: Pair) {
    let r = 1e14
    for (let i=0; i<=100; ++i)
        for (let j=0; j<=100; ++j)
            if (a[0] * i + b[0] * j === target[0] && a[1] * i + b[1] * j === target[1])
                r = Math.min(r, 3*i + j)
    return r === INF ? 0 : r
}

let r1 = 0
for (let i=0; i<input.length; i += 3)
    r1 += winCost(input[i], input[i+1], input[i+2])
console.log("Part 1 =>", r1)


const assert = (cond: boolean, msg: string) => { if (!cond) throw Error(msg) }


function winCost2(a: Pair, b: Pair, t: Pair) {
    const nb = (t[1]*a[0] - t[0]*a[1]) / (a[0]*b[1] - a[1]*b[0])
    const na1 = (t[0] - b[0] * nb) / a[0]
    const na2 = (t[1] - b[1] * nb) / a[1]
    assert(Math.abs(na1-na2) < 1, `WRONG NA2 ${na1} ${na2}`)
    const na = na1
    if (na == Math.floor(na) && nb == Math.floor(nb)) {
        console.log(a, b, t, na, nb)
        for (let i=0; i<2; ++i)
            assert(a[i] * na + b[i] * nb === t[i], "ALMOST")
        return 3*na + nb
    }
    return 0
}


// const A = 10000000000000
const A = 0
let r2 = 0
for (let i=0; i<input.length; i += 3) {
    input[i+2] = input[i+2].map(a => A + a)
    const a = input[i], b = input[i+1], t = input[i+2]
    console.log(i)
    const cost = winCost2(a, b, t)
    r2 += cost
}
console.log("Part 2 =>", r2)
