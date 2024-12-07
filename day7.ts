const IN = "day7.in"
// const IN = "day7small.txt"
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\n").map(s => s.split(/[: ]+/).map((v) => parseInt(v)))

function canDo(nums: number[]): boolean {
    const target = nums[0]

    function f(c: number, i: number): boolean {
        if (i >= nums.length) return c == target
        if (c > target) return false
        return (
            f(c + nums[i], i+1) ||
            f(c * nums[i], i+1)
        )
    }

    return f(nums[1], 2)
}

const r1 = input.filter(canDo).map(nums => nums[0]).reduce((s, a) => s+a, 0)
console.log("Part 1 =>", r1)

function canDo2(nums: number[]): boolean {
    const target = nums[0]

    function f(c: number, i: number): boolean {
        if (i >= nums.length) return c == target
        if (c > target) return false
        return (
            f(c + nums[i], i+1) ||
            f(c * nums[i], i+1) ||
            f(+("" + c + nums[i]), i+1)
        )
    }

    return f(nums[1], 2)
}

const r2 = input.filter(canDo2).map(nums => nums[0]).reduce((s, a) => s+a, 0)
console.log("Part 2 =>", r2)
