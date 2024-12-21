const IN_SMALL = "day21small.in"
const IN_BIG = "day21.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n")

const INF = 1e12

const _DIRECTIONS = "<v>^A"
const NUM_A = 10
const DIR_A = 4

function dirKeyCanGo(current: number, dir: number) {
    switch (dir) {
        case 0: return ![0,3].includes(current)
        case 1: return [3,4].includes(current)
        case 2: return ![2,4].includes(current)
        case 3: return [1,2].includes(current)
    }
    throw Error(`WTF direction ${dir}`)
}

function dirKeyMove(current: number, dir: number) {
    switch (dir) {
        case 0: return current-1
        case 1: return current-2
        case 2: return current+1
        case 3: return current+2
    }
    throw Error(`WTF direction ${dir}`)
}

function numKeyCanGo(current: number, dir: number) {
    switch (dir) {
        case 0: return ![0,1,4,7].includes(current)
        case 1: return ![0,1,NUM_A].includes(current)
        case 2: return ![3,6,9,NUM_A].includes(current)
        case 3: return ![7,8,9].includes(current)
    }
    throw Error(`WTF direction ${dir}`)
}

function numKeyMove(current: number, dir: number) {
    switch (dir) {
        case 0: return current === NUM_A ? 0 : current - 1
        case 1: return current === 2 ? 0 : (current === 3 ? NUM_A : current - 3)
        case 2: return current === 0 ? NUM_A : current + 1
        case 3: return current === 0 ? 2 : (current === NUM_A ? 3 : current + 3)
    }
    throw Error(`WTF direction ${dir}`)
}

const key = (a: number[]) => a.reduce((s, x, i) => s * (i <= 1 ? 100 : 10) + x, 0)
const numAllA = (x: number, n: number) => {
    const a = new Array<number>(n+1).fill(DIR_A)
    a[0] = x
    return a
}

const prev = new Map<number, number>()
const controlKeys = new Map<number, number>()

function distFromTo(a: number, t: number, n: number) {
    const first = numAllA(a, n)
    let front = [first]
    const dist = new Map<number, number>()
    prev.clear()
    controlKeys.clear()
    dist.set(key(first), 0)
    while (front.length) {
        let nf: typeof front = []

        for (const k of front) {
            // console.log("start front", k0, k1, k2)
            const kk = key(k)
            const kd = dist.get(kk)! + 1

            const addFront = (n: number[], controlKey: number) => {
                // console.log("add front", k0, k1, k2)
                const kn = key(n)
                if ((dist.get(kn) ?? INF) > kd) {
                    dist.set(kn, kd)
                    nf.push([...n])
                    prev.set(kn, kk)
                    controlKeys.set(kn, controlKey)
                }
            }

            // press dir
            const lastk = k[k.length-1]
            for (let dir=0; dir<4; ++dir) {
                if (dirKeyCanGo(lastk, dir)) {
                    k[k.length-1] = dirKeyMove(lastk, dir)
                    addFront(k, dir)
                }
            }
            k[k.length-1] = lastk

            // press A
            let i4 = k.length - 1
            while (i4 >= 1 && k[i4] === DIR_A) --i4

            if (i4 === 0) {
                // all but numeric are at A
                if (k[0] === t) return kd // press
            } else if (i4 === 1) {
                if (numKeyCanGo(k[0], k[1])) {
                    k[0] = numKeyMove(k[0], k[1])
                    addFront(k, DIR_A)
                }
            } else {
                if (dirKeyCanGo(k[i4-1], k[i4])) {
                    k[i4-1] = dirKeyMove(k[i4-1], k[i4])
                    addFront(k, DIR_A)
                }
            }
        }

        front = nf
    }
    return NaN
}

function codeDist(s: string, n=2) {
    let r = 0
    let pc = 10
    for (let i=0; i<s.length; ++i) {
        const cc = s.charAt(i) === 'A' ? 10 : +s.charAt(i)
        r += distFromTo(pc, cc, n)
        pc = cc
    }
    return r
}


function part1() {
    const codesDist = input.map((code) => [code, codeDist(code, 2)] as [string, number])
    codesDist.forEach((v) => console.log(v))
    return codesDist.reduce((s, a) => s + a[1] * (+(a[0].slice(0, -1))), 0)
}

// console.log(part1())

function getPath(t: number, n: number) {
    let k: number | undefined = key(numAllA(t, n))
    const path: string[] = ["A"]
    while (k != null) {
        path.push(_DIRECTIONS[controlKeys.get(k)!])
        k = prev.get(k)
    }
    return path.reverse().join("")
}

// input.map((code) => [code, ...(new Array(10).fill(0).map((_, i) => codeDist(code, i+1)))]).forEach((v) => console.log(v.join(" ")))

const k2 = (a: number, b: number) => 100*a + b

function allShortest(n: number, canMove: (current: number, dir: number) => boolean, move: (current: number, dir: number) => number) {
    function dfs(u: number, d: number, dist: number[], path: number[], best: number[][][]) {
        dist[u] = d
        const bu = best[u]
        if (!bu || bu.length === 0 || bu[0].length > d) best[u] = [[...path]]
        else if (bu && bu[0].length === d) bu.push([...path])
        else throw Error("BOOO DFS " + u)
        for (let i=0; i<4; ++i)
            if (canMove(u, i)) {
                const v = move(u, i)
                if (dist[v] >= d + 1) {
                    path.push(i)
                    dfs(v, d+1, dist, path, best)
                    path.pop()
                }
            }
    }


    const allPaths = new Array(n).fill(0).map(() => new Array(n).fill(0).map(() => [] as number[][]))
    for (let i=0; i<n; ++i) {
        const dist = new Array<number>(n).fill(INF)
        const path: number[] = []
        const best = new Array<number>(n).fill(0).map(() => [] as number[][])
        dfs(i, 0, dist, path, best)
        allPaths[i] = best
    }
    return allPaths
}


function shortestNum() {
    return allShortest(11, numKeyCanGo, numKeyMove)
}


function shortestDir() {
    return allShortest(5, dirKeyCanGo, dirKeyMove)
}


const dirString = (code: number[]) => code.map(d => _DIRECTIONS[d]).join("")


function part2(levels = 25) {
    const snum = shortestNum()
    const sdir = shortestDir()

    const roboCache = new Map<string, number>()

    function p2dist(code: number[], level: number) {
        // const key = code.reduce((s, a) => 100*s + a + 1, 0) * 100 + level
        const key = [level, ...code].join("-")
        const cached = roboCache.get(key)
        if (cached != null) return cached
        // console.log(level > 0 ? dirString(code) : code, level)

        if (level > levels) {
            roboCache.set(key, code.length)
            return code.length
        }
        const layout = level === 0 ? snum : sdir
        let from = level === 0 ? NUM_A : DIR_A
        let s = 0
        for (const to of code) {
            let minLen = INF
            // console.log("   ", _DIRECTIONS[from], _DIRECTIONS[to], level)
            for (const path of layout[from][to]) {
                minLen = Math.min(minLen, p2dist([...path, DIR_A], level + 1))
            }
            s += minLen
            from = to
        }

        roboCache.set(key, s)
        return s
    }

    const codesDist = input.map((code) => [code, p2dist(code.split("").map((v) => v === "A" ? NUM_A : +v), 0)] as [string, number])
    codesDist.forEach((v) => console.log(v))
    return codesDist.reduce((s, a) => s + a[1] * (+(a[0].slice(0, -1))), 0)
}


console.log(part2(25))
