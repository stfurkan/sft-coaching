import NextAuth, { Session, User } from "next-auth";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";

export const authOptions = {
  callbacks: {
    async session({ session, token }: { session: Session, token: any }) {
      if (token.id) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any, user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username as string))
          .get();
        
        if (!user || !user.password) return null;
        
        const isValidPassword = await bcrypt.compare(credentials.password as string, user.password);
        
        if (!isValidPassword) return null;
        
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    }),
  ],
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt" as unknown as "jwt",
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authOptions,
});
