import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";

const demoUsers = [
  {
    id: "admin-1",
    name: "Chanda Admin",
    email: "admin@zamreal.co",
    password: "admin123",
    role: "admin"
  },
  {
    id: "manager-1",
    name: "Lusungu Manager",
    email: "manager@zamreal.co",
    password: "manager123",
    role: "manager"
  }
];

async function findUserByEmail(email) {
  if (!email) return null;

  if (process.env.MONGODB_URI) {
    await connectMongo();
    const dbUser = await User.findOne({ email }).lean().catch(() => null);
    if (dbUser) {
      return { ...dbUser, id: dbUser._id.toString() };
    }
  }

  return demoUsers.find((user) => user.email === email) ?? null;
}

async function verifyPassword(user, password) {
  if (!user) return false;

  if (user.password && user.password.startsWith("$2")) {
    return bcrypt.compare(password, user.password);
  }

  return user.password === password;
}

export const authOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase();
        const user = await findUserByEmail(normalizedEmail);
        const isValid = await verifyPassword(user, credentials.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? "manager"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
