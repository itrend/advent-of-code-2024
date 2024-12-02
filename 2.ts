const IN = "2.txt"
// const IN = "2small.txt"
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n")
    .filter((line) => line.length > 0)
    .map(
        (line) => line.split(/\s+/).map((v) => parseInt(v))
    )

function isSafe(a: number[]): boolean {
    const sgn = Math.sign(a[1] - a[0])
    if (sgn == 0) return false
    for (let i = 1; i < a.length; ++i) {
        const diff = a[i] - a[i-1]
        if (Math.sign(diff) != sgn || Math.abs(diff) > 3) return false
    }
    return true
}

const r1 = input.reduce((s, a) => s + (isSafe(a) ? 1 : 0), 0)
console.log("Part 1 =>", r1)

function isSafe2(a: number[]): boolean {
    for (let i = 0; i < a.length; ++i) {
        const b = [...a]
        b.splice(i, 1)
        if (isSafe(b)) return true
    }
    return false
}

const r2 = input.reduce((s, a) => s + (isSafe2(a) ? 1 : 0), 0)
console.log("Part 2 =>", r2)
