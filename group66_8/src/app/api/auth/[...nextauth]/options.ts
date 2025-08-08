import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ExtendedToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  role: string;
  rememberMe: boolean;
  error?: string;
}

interface ExtendedUser {
  email: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  rememberme: boolean;
}

const refreshToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
  try {
    const res = await fetch("https://a2sv-application-platform-backend-team8.onrender.com/auth/token/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const hold = await res.json();
    //console.log("🔁 Refresh Token Response:", hold);

    if (!res.ok || !hold.data?.access) {
      throw new Error(hold.message || "Failed to refresh access token");
    }

    return {
      ...token,
      accessToken: hold.data.access,
      accessTokenExpires: Date.now() + 15 * 60 * 1000
      error: undefined,
    };
  } catch (error) {
    //console.error("🔴 Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const Options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, 
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        rememberme: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        const userlink = "https://a2sv-application-platform-backend-team8.onrender.com/auth/token";
        const adminlink = "https://a2sv-application-platform-backend-team8.onrender.com/admin/login";

        const body = {
          email: credentials?.email,
          password: credentials?.password,
        };

        try {
          const res = await fetch(
            credentials?.role.toLowerCase() === "user" ? userlink : adminlink,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          );

          const hold = await res.json();

          if (!res.ok || !hold.data?.access) {
            throw new Error(hold.message || "Authentication failed");
          }

          const user: ExtendedUser = {
            email: credentials?.email || "",
            accessToken: hold.data.access,
            refreshToken: hold.data.refresh || "",
            role: credentials?.role?.toLowerCase() === "admin" ? "admin" : hold.data.role,
            rememberme: credentials?.rememberme === "true",
          };

          return user;
        } catch (error) {
          throw new Error("Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },

    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        const u = user as ExtendedUser;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.role = u.role;
        token.rememberMe = u.rememberme;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // Always 15 minutes
        return token;
      }

      const isExpired = Date.now() >= (token.accessTokenExpires ?? 0) - 60 * 1000;

      if (isExpired) {
        if (token.rememberMe) {
          return await refreshToken(token as ExtendedToken);
        } else {
          return {
            ...token,
            error: "SessionExpired",
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
};
