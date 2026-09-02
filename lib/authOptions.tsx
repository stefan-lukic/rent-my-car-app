import connectToDatabase from '@/lib/db/mongoose';
import User from '@/lib/model/User';
import bcrypt from 'bcryptjs';
import { NextAuthOptions, Session } from 'next-auth';
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

        // The version is excluded by default and must be included in new JWTs.
        const user = await User.findOne({ email }).select('+sessionVersion');
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

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          sessionVersion: user.sessionVersion ?? 0,
        };
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
        // Record the session generation at sign-in time.
        token.sessionVersion =
          (user as typeof user & { sessionVersion?: number }).sessionVersion ??
          0;
        token.revoked = false;
        return token;
      }

      if (!token.id || token.revoked) return token;

      await connectToDatabase();

      // Compare every server-side session read with the current DB version.
      const currentUser = await User.findById(token.id)
        .select('+sessionVersion')
        .lean();
      const currentVersion = currentUser?.sessionVersion ?? 0;
      const issuedVersion =
        typeof token.sessionVersion === 'number' ? token.sessionVersion : 0;

      if (!currentUser || currentVersion !== issuedVersion) {
        token.revoked = true;
        delete token.id;
      }

      return token;
    },
    async session({ session, token }) {
      // Returning no session keeps revoked JWTs out of every protected API.
      if (token.revoked || typeof token.id !== 'string') {
        return null as unknown as Session;
      }

      if (session.user) session.user.id = token.id;
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
