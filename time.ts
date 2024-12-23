export function timeIt<T>(f: () => T): T {
    const t = new Date().getTime()
    try {
        return f()
    } finally {
        console.log("Time:", new Date().getTime() - t)
    }
}
