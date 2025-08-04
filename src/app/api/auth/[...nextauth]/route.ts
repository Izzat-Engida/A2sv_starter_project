import NextAuth from "next-auth";
import {Options} from './options';

const handler = NextAuth(Options);
export { handler as GET, handler as POST };