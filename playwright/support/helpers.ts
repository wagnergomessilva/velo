export function generateOrderCode(prefix = 'VLO') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomCode = ''

    for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * chars.length)
        randomCode += chars[index]
    }

    return `${prefix}-${randomCode}`
}