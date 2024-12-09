const IN_SMALL = "day9small.in"
const IN_BIG = "day9.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.trim().split("").map((v) => parseInt(v))

function part1() {
    const fst = []
    for (let i=0; i<input.length; i += 2) {
        const fid = i/2
        for (let j=0; j<input[i]; ++j) fst.push(fid)
    }

    let r1 = 0
    for (let i=0, p=0, tfb=fst.length; i<input.length && tfb > 0; ++i) {
        if (i%2 === 0) {
            const fid = i/2
            for (let j=0; j<input[i] && tfb > 0; ++j, ++p, --tfb)
                r1 += fid * p
        } else {
            for (let j=0; j<input[i] && tfb > 0 && fst.length > 0 && tfb > 0; ++j, ++p, --tfb)
                r1 += (fst.pop() ?? 0) * p
        }
    }
    return r1
}

console.log("Part 1 =>", part1())

function part2() {
    const fs = new Array<number[]>(10)
    for (let i=0; i<10; ++i) fs[i] = []
    for (let i=0; i<input.length; i += 2) {
        const fid = i/2
        fs[input[i]].push(fid)
    }
    const fslast = (s: number) => fs[s][fs[s].length - 1]

    let r2 = 0
    let totalLeft = Math.ceil(input.length/2)
    const moved = new Set<number>()
    for (let i=0, p=0; i<input.length && totalLeft > 0; ++i) {
        const fid = Math.floor(i/2)
        if (i%2 === 0) {
            if (moved.has(fid)) {
                p += input[i]
                continue
            }
            totalLeft -= 1
            for (let j=0; j<input[i]; ++j, ++p) r2 += fid * p
        } else {
            const findFile = (s: number) => {
                let mi = -1
                for (let i=1; i<=s; ++i) {
                    if (fs[i].length > 0 && fslast(i) > fid && (mi == -1 || fslast(i) > fslast(mi)))
                        mi = i
                }
                return mi
            }

            let space = input[i]
            while (space > 0) {
                const fileSize = findFile(space)
                if (fileSize < 0) break
                totalLeft -= 1
                space -= fileSize
                const nfid = fs[fileSize].pop() ?? 0
                moved.add(nfid)
                for (let j=0; j<fileSize; ++j, ++p) r2 += nfid * p
            }
            p += space
        }
    }
    return r2
}

console.log("Part 2 =>", part2())
