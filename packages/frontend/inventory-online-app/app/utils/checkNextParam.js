export default function checkNextParam(nextUrl) {
    if (typeof nextUrl === 'string' && nextUrl.startsWith('/')) {
        return nextUrl
    }

    return '/store'
}