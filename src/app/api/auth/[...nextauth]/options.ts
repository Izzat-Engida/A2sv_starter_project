import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"



export const Options:NextAuthOptions={
  secret:process.env.NEXTAUTH_SECRET,
    providers:[
        CredentialsProvider({
            credentials:{
                email:{label:"Email", type:"email"},
                password:{label:"Password", type:"password"}
              
            },
            async authorize(credentials,req) {
              if (req.query?.role==="admin") {
                
              
                const res= await fetch("https://a2sv-application-platform-backend-team8.onrender.com/admin/login",{
                    method:"POST",
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(credentials)
                })
                if (!res.ok) {
                  const error=await res.json()
                    throw new Error("Failed to login")
                }
                const hold=await res.json()
                if(hold.success &&hold.data?.access){
                  return {
                    email:credentials?.email,
                    accessToken:hold.data.access,
                    refreshToken:hold.data.refresh,
                    role:"admin"
                  }
                }
            }
            else{
              const res= await fetch("https://a2sv-application-platform-backend-team8.onrender.com/auth/token",{
                    method:"POST",
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(credentials)
                })
                if (!res.ok) {
                  const error=await res.json()
                    throw new Error("Failed to login")
                }
                const hold=await res.json()
                if(hold.success &&hold.data?.access){
                  return {
                    email:credentials?.email,
                    accessToken:hold.data.access,
                    refreshToken:hold.data.refresh,
                    role:"user"
                  }
                }

            }
          }

        })
    
    ],
    callbacks:{
    async jwt({token,user}){
          if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 3600 * 1000; 
        token.role=user.role
      }
      
      return token;

        },
    async session({session,token}){
        session.role=token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        return session;
    },
    
    }
}