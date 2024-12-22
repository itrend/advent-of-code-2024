const IN_SMALL = "day22small.in"
const IN_BIG = "day22.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n").map((v) => parseInt(v))
// const input = inputRaw.split("\n").map(s => s.split(""))

const M = 16777216
const Mn = BigInt(M)

function iter(x: number) {
    x ^= x << 6
    x %= M
    x ^= x >> 5
    x %= M
    x ^= x << 11
    x %= M
    return x
}


function iterb(x: bigint) {
    x ^= x << 6n
    x %= Mn
    x ^= x >> 5n
    x %= Mn
    x ^= x << 11n
    x %= Mn
    return x
}


function part1(n: number = 2000) {
    const ns = input.map(x => {
        let xn = BigInt(x)
        for (let i=0; i<n; ++i) xn = iterb(xn)
        return xn
    })
    return ns.reduce((s, a) => s + a, 0n)
}


console.log("Part 1 =>", part1(2000))


function part2(n: number = 2000) {
    const ns = input.map(x => {
        let xn = BigInt(x)
        const ls = [Number(xn % 10n)]
        for (let i=0; i<n; ++i) {
            xn = iterb(xn)
            ls.push(Number(xn % 10n))
        }
        return ls
    })
    const totals = new Map<string, number>()
    ns.forEach((seq, bn) => {
        const seen = new Set<string>()
        for (let i=0; i<seq.length-4; ++i) {
            const ck = []
            for (let j=1; j<=4; ++j) {
                ck.push(seq[i+j] - seq[i+j-1])
            }
            const cks = ck.join(" ")
            if (!seen.has(cks)) {
                totals.set(cks, (totals.get(cks) ?? 0) + seq[i+4])
                seen.add(cks)
            }
        }
    })
    // const x = totals.entries().toArray().toSorted(([,a], [,b]) => b-a)
    // console.log(x)
    return Math.max(...totals.values())
}


console.log("Part 2 =>", part2(2000))
