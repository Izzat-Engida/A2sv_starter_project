import NextAuth, { DefaultSession } from "next-auth";

// this process is know as module augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    accessTokenExpires?: number;
    authError?: string; // Add this here
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    rememberme?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    rememberme?: boolean;
    accessTokenExpires?: number;
    error?: string; // Add here as well
  }
}
