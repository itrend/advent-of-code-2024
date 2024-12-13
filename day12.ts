const IN_SMALL = "day12small3.in"
const IN_BIG = "day12.in"
let IN = IN_BIG
// IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const grid = inputRaw.split("\n").map(s => s.split(""))

const inGrid = (r: number, c: number) => 0 <= r && r < grid.length && 0 <= c && c < grid[r].length

type Coord = [number, number]
type Region = {
    index: number
    s: number
    extH: Coord[] // horizontal external/border walls
    extV: Coord[] // vertical external/border walls
}

const regions: Region[] = []
const regionGrid: number[][] = grid.map(row => row.map(() => -1))

const D = [[-1,0], [1,0], [0,1], [0,-1]]

function fill(r: number, c: number, region: Region) {
    region.s += 1
    regionGrid[r][c] = region.index
    for (const [dr, dc] of D) {
        const rr = r + dr, cc = c + dc
        if (inGrid(rr, cc) && grid[rr][cc] === grid[r][c]) {
            if (regionGrid[rr][cc] < 0)
                fill(rr, cc, region)
        } else {
            const extList = dr === 0 ? region.extV : region.extH
            extList.push([r + Math.max(dr, 0), c + Math.max(dc, 0)])
        }
    }
}

for (let r=0; r<grid.length; ++r)
    for (let c=0; c<grid[r].length; ++c)
        if (regionGrid[r][c] < 0) {
            const rid = regions.length
            regions.push({
                index: rid,
                s: 0,
                extH: [],
                extV: [],
            })
            fill(r, c, regions[rid])
        }

const r1 = regions.reduce((s, r) => s + r.s * (r.extH.length + r.extV.length), 0)
console.log("Part 1 =>", r1)


function sides(region: Region): number {
    function horizontalSides(coords: Coord[], regionF: (r: number, c: number) => number): number {
        const regionSide = (r: number, c: number) => [regionF(r-1, c), regionF(r, c)].indexOf(region.index)
        coords.sort(([a1, a2], [b1, b2]) => a1-b1 === 0 ? a2-b2 : a1-b1)
        let r=0
        for (let i=0, j=1; i<coords.length; i=j++, ++r) {
            const r = coords[i][0], c = coords[i][1]
            const side = regionSide(r, c)
            while (j < coords.length
                && r === coords[j][0]
                && coords[j][1] === 1 + coords[j-1][1]
                && side === regionSide(r, coords[j][1])
            ) ++j
        }
        return r
    }
    const regionFund = (r: number, c: number) => regionGrid[r]?.[c]
    return horizontalSides(region.extH, regionFund) +
        horizontalSides(region.extV.map(([r, c]) => ([c, r])), (c, r) => regionFund(r, c))
}


const r2 = regions.reduce((s, region) => s + region.s * sides(region), 0)
console.log("Part 2 =>", r2)
