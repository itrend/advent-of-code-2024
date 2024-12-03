const IN = "day3.txt"
// const IN = "day3small2.txt"
const inputRaw = Deno.readTextFileSync(IN)

const muls = [...inputRaw.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)]
const r1 = muls.map(m => (+m[1]) * (+m[2])).reduce((s, v) => s + v, 0)
console.log("Part 1 =>", r1)

let enabled = true
let s = 0
const ops = [...inputRaw.matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g)]
for (const m of ops) {
    if (m[0] === "do()") enabled = true
    else if (m[0] === "don't()") enabled = false
    else if (enabled) s += (+m[1]) * (+m[2])
}
console.log("Part 2 =>", s)

const r2 = ops.reduce((st, m) => {
    switch (m[0]) {
        case "do()": st.e = true; break
        case "don't()": st.e = false; break
        default: if (st.e) st.s += (+m[1]) * (+m[2])
    }
    return st
}, {e: true, s: 0}).s
console.log("Part 2 =>", r2)
