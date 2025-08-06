import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authtoken=request.cookies.get('authtoken')?.value
    const protectedRoutes = ['/Profile', '/Dashboardanalytics','/AdminCycles'];
    const temp=protectedRoutes.some(route=>
        request.nextUrl.pathname.startsWith(route))
        if(authtoken && temp){
            const signInUrl=new URL("/auth/SigninAdmin",request.url);
            signInUrl.searchParams.set('redirect',request.nextUrl.pathname);
         return NextResponse.redirect(signInUrl);
        }
    return NextResponse.next();
}