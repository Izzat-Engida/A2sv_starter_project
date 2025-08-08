import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import type { Session } from "next-auth";
interface ExtendedToken extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  role: string;
  rememberme: boolean;
  error?: string;
}

interface ExtendedUser extends User {
  email: string;
  accessToken: string;
  refreshToken: string;
  role: string;
  rememberme: boolean;
}

const refreshToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
  try {
    const res = await fetch(
      "https://a2sv-application-platform-backend-team8.onrender.com/auth/token/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );

    const hold = await res.json();
    console.log("🔁 Refresh Token Response:", hold);

    if (!res.ok || !hold.data?.access) {
      throw new Error(hold.message || "Failed to refresh access token");
    }

    return {
      ...token,
      accessToken: hold.data.access,
      accessTokenExpires:
        Date.now() +
        (token.rememberme ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000),
      error: "RefreshAccessTokenError",
    };
  } catch (error) {
    console.error("🔴 Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

export const Options = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
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
        const userlink =
          "https://a2sv-application-platform-backend-team8.onrender.com/auth/token";
        const adminlink =
          "https://a2sv-application-platform-backend-team8.onrender.com/admin/login";

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
          console.log("🔐 Authorize Response:", hold);

          if (!res.ok || !hold.data?.access) {
            throw new Error(hold.message || "Authentication failed");
          }

          const user: ExtendedUser = {
            id: credentials?.email || "unknown",
            email: credentials?.email || "",
            accessToken: hold.data.access,
            refreshToken: hold.data.refresh || "",
            role:
              credentials?.role?.toLowerCase() === "admin"
                ? "admin"
                : hold.data.role,
            rememberme: credentials?.rememberme === "true",
          };

          return user;
        } catch (error) {
          console.error("🔴 Authorize error:", error);
          throw new Error("Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt(params: any) {
      const { token, user } = params as { token: JWT; user?: User };
      if (user) {
        const u = user as ExtendedUser;
        (token as any).accessToken = u.accessToken;
        (token as any).refreshToken = u.refreshToken;
        (token as any).role = u.role;
        (token as any).rememberme = u.rememberme;
        (token as any).accessTokenExpires =
          Date.now() +
          (u.rememberme ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000);
        return token;
      }

      if (
        (token as any).accessTokenExpires &&
        Date.now() >= (token as any).accessTokenExpires - 60 * 1000
      ) {
        return await refreshToken(token as ExtendedToken);
      }
      return token;
    },
    async session({ session, token, ..._rest }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.accessTokenExpires = token.accessTokenExpires;
      session.authError = (token as ExtendedToken).error; // use authError instead of error
      return session;
    },
  },
};
