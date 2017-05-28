
export function parseHash<T extends {}>(hash: string): T {
    if (hash.charAt(0) !== "#") {
        return {} as any
    }

    const withoutHash = hash.substring(1, hash.length - 1)

    let values: any = {}

    withoutHash.split("&").map((cb) => {
        const resultSet = cb.split("=")
        values[resultSet[0]] = resultSet[1]
    })

    return values
}