function main(args: string[]) {
    const day = args[0] || new Date().getDate()
    const inSmall = `day${day}small.in`
    const inBig = `day${day}.in`
    const srcFile = `day${day}.ts`

    const theSource = `
const IN_SMALL = "${inSmall}"
const IN_BIG = "${inBig}"
let IN = IN_BIG
IN = IN_SMALL
const inputRaw = Deno.readTextFileSync(IN)
const input = inputRaw.split("\\n").map(s => s.split(/[: ]+/).map((v) => parseInt(v)))
// const input = inputRaw.split("\\n").map(s => s.split(""))

`.trimStart()

    const files = [srcFile, inSmall, inBig]
    for (const f of files)
        if (fileExists(f))
            throw new Error(`File exists, not overwriting: ${f}`)

    Deno.writeTextFileSync(srcFile, theSource)
    Deno.writeTextFileSync(inSmall, "")
    Deno.writeTextFileSync(inBig, "")
}


function fileExists(s: string): boolean {
    try {
        const stat = Deno.statSync(s)
        return stat.isFile
    } catch {
        return false
    }
}


main(Deno.args)
