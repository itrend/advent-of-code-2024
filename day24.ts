const IN_SMALL = "day24small.in"
const IN_BIG = "day24.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n\n")
const values = input[0].split("\n").map((s) => s.split(/: /).map((v, i) => i === 1 ? +v : v) as [string, number])
const exprs = input[1].split("\n").map((s) => s.split(/[ \->]+/))
// const input = inputRaw.split("\n").map(s => s.split(""))

const valMap = new Map<string, number>()
let exprMap = new Map<string, string[]>()

const max = (a: string, b: string) => a > b ? a : b
const min = (a: string, b: string) => a < b ? a : b

for (const [name, v] of values) valMap.set(name, v)
for (const [op1, op, op2, res] of exprs) exprMap.set(res, [op, min(op1, op2), max(op1, op2)])

const ops: Record<string, (a: number, b: number) => number> = {
    'OR': (a, b) => a | b,
    'AND': (a, b) => a & b,
    'XOR': (a, b) => a ^ b,
}

function getVal(name: string) {
    let v = valMap.get(name)
    if (v == null) {
        const expr = exprMap.get(name)!
        const vs = [getVal(expr[1]), getVal(expr[2])] as [number, number]
        v = ops[expr[0]](...vs)
        valMap.set(name, v)
    }
    return v
}


function part1() {
    return exprMap.keys()
        .filter(s => s.startsWith("z"))
        .map((s) => BigInt(getVal(s)) << BigInt(+s.slice(1)))
        .reduce((s, a) => s | a, 0n)
}


console.log("Values#", valMap.size)
console.log("Exprs#", exprMap.size)
// console.log("Part 1 =>", part1())


function expressR(name: string): string {
    const expr = exprMap.get(name)
    if (expr == null) return name
    const [op, v1, v2] = expr
    return `(${expressR(v1)} ${op} ${expressR(v2)})`
}


function sortArgs() {
    exprMap.values().forEach(expr => {
        const e1 = min(expr[1], expr[2]), e2 = max(expr[1], expr[2])
        expr[1] = e1
        expr[2] = e2
    })
}


function rename(old: string, newName: string) {
    exprMap.set(newName, exprMap.get(old)!)
    exprMap.values().forEach((v) => {
        if (v[1] === old) v[1] = newName
        if (v[2] === old) v[2] = newName
    })
    exprMap.delete(old)
}


const parseNumVar = (s: string) => {
    const v = +s.slice(1)
    if (isNaN(v)) throw new Error("NaN from " + s)
    return v
}


const varName = (c: string, i: number) => c + i.toString().padStart(2, '0')


function expressAll() {
    for (let i=0; i<46; ++i) {
        const z = varName('z', i)
        let e = expressR(z)
        if (e.charAt(0) == '(' && e.charAt(e.length-1) == ')') e = e.slice(1, e.length-1)
        console.log(z, '=', e)
    }
}


const r2: string[] = []


function swapExpr(s1: string, s2: string) {
    r2.push(s1)
    r2.push(s2)
    const a = exprMap.get(s1)!
    exprMap.set(s1, exprMap.get(s2)!)
    exprMap.set(s2, a)
}


const varVal = (c: string) => new Array(45).fill(0)
    .map((_, i) => valMap.get(varName(c, i))!)
    .reduce((s, a, i) => s | (BigInt(a) << BigInt(i)), 0n)


function explore2() {
    sortArgs()
    const reduces = exprMap.entries()
        .filter(([name, [op, v1, v2]]) => v1.startsWith("x") && v2.startsWith("y"))
        .map(([name, [op, v1, v2]]) => {
            const n1 = parseNumVar(v1), n2 = parseNumVar(v2)
            if (n1 != n2) console.log(`!!! Different numbers on the right for '${name}' = '${v1}' ${op} '${v2}'`)
            return [name, `A_xy_${op.toLowerCase()}_${n1}`]
        })

    reduces.forEach(([n, nn]) => {
        console.log("rename & reduce", n, nn)
        rename(n, nn)
        exprMap.delete(nn)
    })
    sortArgs()
    expressAll()
}


function part2() {
    swapExpr("twr", "z39")
    swapExpr("ggn", "z10")
    swapExpr("grm", "z32")
    swapExpr("jcb", "ndw")

    // const x = varVal('x'), y = varVal('y')
    // const r1 = part1()
    // console.log(x, y, x + y, r1, x+y === r1)

    return r2.sort().join(",")
}

console.log("Part 2 =>", part2())
