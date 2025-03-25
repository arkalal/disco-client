import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../utils/dbConnect";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { getNextAuthURL } from "../utils/auth-url";

// This ensures NextAuth has the correct URL in all environments
const nextAuthUrl = getNextAuthURL();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          // Find user by email
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user) {
            return null;
          }

          // Compare passwords
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split("@")[0],
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "a-very-secure-secret-for-next-auth",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  // Explicitly set the URL and trust host to handle Vercel deployments correctly
  trustHost: true,
  // Only set this if process.env.NEXTAUTH_URL is not available
  ...(process.env.NEXTAUTH_URL ? {} : { url: nextAuthUrl }),
});
