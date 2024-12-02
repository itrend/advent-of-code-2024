const inputRaw = Deno.readTextFileSync("day1.txt")
const input = inputRaw.split("\n")
    .filter((line) => line.length > 0)
    .map(
        (line) => line.split(/\s+/).map((v) => parseInt(v))
    )
const a = input.map((row) => row[0])
const b = input.map((row) => row[1])

const as = a.toSorted()
const bs = b.toSorted()
const r1 = new Array(as.length).fill(null).reduce((s, _, i) => s + Math.abs(as[i] - bs[i]), 0)
console.log("Part 1 =>", r1)

const bc: Record<number, number> = {}
bs.forEach((x) => bc[x] = (bc[x] ?? 0) + 1)
const r2 = as.map((x) => x * (bc[x] ?? 0)).reduce((s, x) => s + x, 0)
console.log("Part 2 =>", r2)
