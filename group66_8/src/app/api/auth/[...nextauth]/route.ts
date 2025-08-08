// eslint-disable-next-line @typescript-eslint/no-explicit-any
import NextAuth from "next-auth/next";
import { Options } from "./options";

const handler = NextAuth(Options as any);
export { handler as GET, handler as POST };
