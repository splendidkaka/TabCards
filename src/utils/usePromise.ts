

function PromiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const results: T[] = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then((res) => {
                results[index] = res
                count++
                if (count === promises.length) {
                    resolve(results)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    })
}