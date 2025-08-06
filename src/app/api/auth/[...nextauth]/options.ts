import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const refreshToken = async (token: any) => {
  try {
    const res = await fetch("https://a2sv-application-platform-backend-team8.onrender.com/auth/token/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const hold = await res.json();
    console.log("Refresh Token Response:", hold);

    if (!res.ok || !hold.data?.success) {
      throw new Error(hold.message || "Failed to refresh token");
    }

    if (hold.data.access) {
      return {
        ...token,
        accessToken: hold.data.access,
        refreshToken: token.refreshToken,
        accessTokenExpires: Date.now() + 60 * 60 * 24 * 7 * 1000,
        error: null,
      };
    }

    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const Options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        rememberme: { label: "rememberme", type: "checkbox" },
      },
      async authorize(credentials) {
        const userlink = "https://a2sv-application-platform-backend-team8.onrender.com/auth/token";
        const adminlink = "https://a2sv-application-platform-backend-team8.onrender.com/admin/login";
        const body = {
          email: credentials?.email,
          password: credentials?.password,
        };

        try {
          const res = await fetch(credentials?.role.toLowerCase() === "user" ? userlink : adminlink, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const hold = await res.json();
          console.log("Authorize Response:", hold);

          if (!res.ok || !hold.success || !hold.data?.access) {
            throw new Error(hold.message || "Authentication failed");
          }

          return {
            email: credentials?.email,
            accessToken: hold.data.access,
            refreshToken: hold.data.refresh || null,
            role: credentials?.role.toLocaleLowerCase()==='admin'? 'admin': hold.data.role,
            rememberme: credentials?.rememberme === "true",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, 
  }
  ,
  
  callbacks: {
    
    async jwt({ token, user }) {
      console.log("JWT - User:", user, "Token:", token);
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.rememberMe = user.rememberme;
        token.accessTokenExpires = Date.now() + (user.rememberme ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000);
        return token;
      }

      if (token.rememberMe && Date.now() >= (token.accessTokenExpires||0) - 5 * 60 * 1000) {
        return await refreshToken(token);
      }

      return token;
    },
    async session({ session, token }) {

      session.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },
};