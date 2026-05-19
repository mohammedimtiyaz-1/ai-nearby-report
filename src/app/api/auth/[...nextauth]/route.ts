import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

// Configure NextAuth with a simple email/password provider
// TODO: Integrate with Prisma User model when database is available
const authOptions: NextAuthOptions = {
  providers: [
    // TODO: Add OAuth providers (Google, GitHub) as needed
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      // TODO: Add user data from database to session
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
