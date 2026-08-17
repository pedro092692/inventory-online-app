import { NextResponse } from 'next/server'
import { verifyToken } from '../utils/verifyToken'

class AuthorizationMiddleWare {
    
    constructor(){
        this.verifyToken = verifyToken
    
    }

    checkAuthorization = async (request) => {
        const token = request.cookies.get('access_token')?.value 
        if (!token) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('next', new URL(request.url).pathname)
            return NextResponse.redirect(redirectUrl)
        }

        try{
            // verify token 
            const res = await this.verifyToken(token, true)
            
            
            if (![1,2,3].includes(res.data.role)){
                return NextResponse.redirect(new URL('/store', request.url))
                // return new NextResponse('Forbidden', { status: 403 })

            }else{
                return NextResponse.next()
            }

        }catch(err){
            return NextResponse.next()
        }
    }

    checkAdmin = async (request) => {
        const token = request.cookies.get('access_token')?.value 
        if (!token) {
             return NextResponse.redirect(new URL('/404', request.url));
        }

        try{
            
            const res = await this.verifyToken(token, true)
            if (res.data.role != 1) {
                return NextResponse.redirect(new URL('/404', request.url));
            }else {
                return NextResponse.next()
            }

        }catch(err){
            return NextResponse.next()
        }
    }
}

const checkAuthorization = new AuthorizationMiddleWare().checkAuthorization
const checkAdmin = new AuthorizationMiddleWare().checkAdmin

export { checkAuthorization, checkAdmin }

