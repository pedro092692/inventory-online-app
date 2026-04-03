import { isRedirectError } from "next/dist/client/components/redirect-error"

export function withErrorHandler(fn, errorMgs=null) {
    return async function(...args) {
        try {
            const result = await fn(...args)
            return { data: result, error: null }
        } catch(error) {
            if (isRedirectError(error)) {
                throw error
            }
            return { data: null, error: errorMgs || error.message }
            
        }
    }
}