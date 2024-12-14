const IN_SMALL = "day14small.in"
const IN_BIG = "day14.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n")
    .map(s => s.split(/[ vp=,]+/).filter(s => s.length).map((v) => parseInt(v)))

const isSmall = input.length < 20
const W = isSmall ? 11 : 101, W2 = Math.floor(W/2)
const H = isSmall ? 7 : 103, H2 = Math.floor(H/2)

const T1 = 100

function wrap(x: number, d: number) {
    x %= d
    return x < 0 ? d + x : x
}

function part1(t: number) {
    return input
        .map(([px, py, vx, vy]) => [px + vx * t, py + vy * t])
        .map(([x, y]) => [wrap(x, W), wrap(y, H)])
        .filter(([x, y]) => x !== W2 && y !== H2)
        .map(([x, y]) => [Math.max(0, Math.sign(x - W2)), Math.max(0, Math.sign(y - H2))])
        .map(([sx, sy]) => sx*2 + sy)
        .reduce((cc, i) => { cc[i] += 1; return cc}, [0, 0, 0, 0])
        .reduce((m, c) => m * c, 1)
}

console.log("Part 1 =>", part1(T1))
