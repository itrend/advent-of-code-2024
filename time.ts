export function timeIt<T>(f: () => T): T {
    let t = new Date().getTime()
    try {
        return f()
    } finally {
        t = new Date().getTime() - t
        console.log(`Time (${f.name}):`, t)
    }
}
