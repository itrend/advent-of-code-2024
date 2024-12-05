const IN = "day5.txt"
// const IN = "day5small.txt"
const inputRaw = Deno.readTextFileSync(IN)
const [pairsRaw, pagesRaw] = inputRaw.split("\n\n")
const pairs = pairsRaw.split("\n").map((s) => s.split("|"))
const pages = pagesRaw.split("\n").map((s) => s.split(","))

const g: Record<string, string[]> = {}
const pairSet: Record<string, boolean> = {}
for (const [u, v] of pairs) {
    if (!g[u]) g[u] = []
    g[u].push(v)
    pairSet[u+"-"+v] = true
}

function isOk1(pages: string[]): boolean {
    for (let i=0; i<pages.length-1; ++i)
        for (let j=i+1; j<pages.length; ++j)
            if (pairSet[pages[j]+"-"+pages[i]]) return false
    return true
}

const r1 = pages
    .filter(isOk1)
    .map(pages => +pages[pages.length >> 1])
    .reduce((s, a) => s + a)
console.log("Part1 =>", r1)


function rearrange(pages: string[]): string[] {
    let boom = true
    while (boom) {
        boom = false
        for (let i=0; i<pages.length-1; ++i)
            for (let j=i+1; j<pages.length; ++j)
                if (pairSet[pages[j]+"-"+pages[i]]) {
                    boom = true
                    const x = pages[j]; pages[j] = pages[i]; pages[i] = x
                }
    }
    return pages
}


const r2 = pages
    .filter(p => !isOk1(p))
    .map(rearrange)
    .map(pages => +pages[pages.length >> 1])
    .reduce((s, a) => s + a)
console.log("Part2 =>", r2)
