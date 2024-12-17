const IN_SMALL = "day17small2.in"
const IN_BIG = "day17.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n\n")
const regs = input[0].split("\n").map(s => s.split(": ")[1]).map(v => BigInt(v))
const prog = input[1].split(": ")[1].split(",").map(v => parseInt(v))

// console.log(regs)
// console.log(prog)

const output: number[] = []


function exec(ip: number): number {
    const op = prog[ip]
    const operandi = prog[ip+1]
    const operand = BigInt(operandi)
    const combo = () => operand <= 3 ? operand : regs[operandi-4]
    switch (op) {
        case 0:
            regs[0] >>= combo()
            break
        case 1:
            regs[1] ^= operand
            break
        case 2:
            regs[1] = combo() & 7n
            break
        case 3:
            if (regs[0] !== 0n) {
                return operandi
            }
            break
        case 4:
            regs[1] ^= regs[2]
            break
        case 5:
            output.push(Number(combo() & 7n))
            break
        case 6:
            regs[1] = regs[0] >> combo()
            break
        case 7:
            regs[2] = regs[0] >> combo()
            break
    }
    return ip + 2
}


function describe(ip: number): string {
    const op = prog[ip]
    const operand = prog[ip+1]
    const comboName = operand <= 3 ? operand.toString() : "ABC".charAt(operand-4)
    switch (op) {
        case 0: return `A >>= ${comboName}`
        case 1: return `B ^= ${operand}`
        case 2: return `B = ${comboName} & 7`
        case 3: return `JNZ ${operand}`
        case 4: return `B ^= C`
        case 5: return `OUT ${comboName} & 7`
        case 6: return `B = A >> ${comboName}`
        case 7: return `C = A >> ${comboName}`
    }
    throw Error("WTF")
}


function describeProg(): string {
    const ds: string[] = []
    for (let ip=0; ip<prog.length; ip += 2) ds.push(describe(ip))
    return ds.join("\n")
}


function execProg(verbose = false) {
    output.splice(0, output.length)
    let ip = 0
    while (ip < prog.length) {
        if (verbose) console.log(ip, regs)
        ip = exec(ip)
    }
    return output
}


function forA(a: bigint) {
    regs[0] = a
    regs[1] = 0n
    regs[2] = 0n
    return execProg()
}


function part1() {
    execProg(true)
    return output.join(",")
}


console.log("Part 1 => ", part1())


function part2() {
    const aPerOut = new Map<number, bigint[]>()
    for (let a = 0n; a<1024n; ++a) {
        const output = forA(a)
        const k = output[0]
        let as = aPerOut.get(k)
        if (as == null) aPerOut.set(k, as = [])
        as.push(a)
    }

    const front = [[...aPerOut.get(prog[0])!]]
    // front[i] & 127 == front[i-1] >> 3
    // front[i] & 15 == front[i-2] >> 6
    // front[i] & 1 == front[i-3] >> 9
    for (let i = 1; i < prog.length; ++i) {
        let ass = aPerOut.get(prog[i])!
        for (let d = 1; d <= 3 && i-d >= 0; ++d) {
            const frontSet = new Set(front[i-d].map((v) => v >> BigInt(d*3)))
            ass = ass.filter((v) => {
                const pv = v & BigInt((1 << (3 * (3 - d) + 1)) - 1)
                return frontSet.has(pv)
            })
        }
        for (let d = 1; d <= 3 && i-d >= 0; ++d) {
            const asSet = new Set(ass.map((v) => v & BigInt((1 << (3 * (3 - d)) + 1) - 1)))
            front[i-d] = front[i-d].filter((v) => {
                const pv = v >> BigInt(d*3)
                return asSet.has(pv)
            })
        }
        front.push(ass)
    }
    let a = front[front.length-1][0]
    for (let i=front.length-2; i>=0; --i) {
        const needle = a & 127n
        const v = front[i].find((v) => (v >> 3n) === needle)!
        a = (a << 3n) | (v & 7n)
    }
    return a
}


console.log(describeProg())
const a = part2()
console.log("Part 2 =>", a)
console.log(forA(a).join(","))
console.log(prog.join(","))
