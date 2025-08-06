import NextAuth from "next-auth";
declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name?: string;
    };
    accessToken: string;
    refreshToken: string;
    role:string;
    rememberme?:boolean;
    accessTokenExpires?: number;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    accessToken: string;
    refreshToken: string;
    role:string;
    rememberme?:boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    role:string;
    rememberme?:boolean;
    accessTokenExpires?: number;
  }
}

