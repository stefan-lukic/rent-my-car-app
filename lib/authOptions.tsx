import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const email =
          typeof credentials?.email === 'string'
            ? credentials.email.trim().toLowerCase()
            : '';

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        const isValid = await bcrypt.compare(
          credentials?.password || '',
          user.password
        );
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
