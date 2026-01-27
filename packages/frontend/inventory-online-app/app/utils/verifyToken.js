const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1'

export async function verifyToken(token, withData = false) {
    const res = await fetch(`${API_BASE_URL}/api/security/verify-token`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: 'include'
    })
    if(withData) {
        return await res.json()
    }
    
    return res

}