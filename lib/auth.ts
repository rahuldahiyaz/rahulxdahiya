import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          department: user.department,
          designation: user.designation,
          profilePhoto: user.profilePhoto,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user for OAuth providers
            const names = user.name?.split(" ") || ["User", "Account"]
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                firstName: names[0] || "User",
                lastName: names.slice(1).join(" ") || "Account",
                role: "USER",
                password: "", // OAuth users start without password
                profilePhoto: user.image,
                oauthProvider: account.provider.toUpperCase(),
                oauthId: account.providerAccountId,
              },
            })

            // Create audit log
            await prisma.auditLog.create({
              data: {
                action: "USER_CREATED_OAUTH",
                details: `User created via ${account.provider} OAuth`,
                userId: newUser.id,
              },
            })

            // Set user data for JWT
            user.id = newUser.id
            user.role = newUser.role
            user.firstName = newUser.firstName
            user.lastName = newUser.lastName
            user.department = newUser.department
            user.designation = newUser.designation
            user.profilePhoto = newUser.profilePhoto
          } else {
            // Update existing user with OAuth info if not already set
            const updateData: any = {}
            
            if (user.image && !existingUser.profilePhoto) {
              updateData.profilePhoto = user.image
            }
            
            if (!existingUser.oauthProvider) {
              updateData.oauthProvider = account.provider.toUpperCase()
              updateData.oauthId = account.providerAccountId
            }

            if (Object.keys(updateData).length > 0) {
              const updatedUser = await prisma.user.update({
                where: { email: user.email! },
                data: updateData,
              })
              
              // Set updated user data
              user.id = updatedUser.id
              user.role = updatedUser.role
              user.firstName = updatedUser.firstName
              user.lastName = updatedUser.lastName
              user.department = updatedUser.department
              user.designation = updatedUser.designation
              user.profilePhoto = updatedUser.profilePhoto
            } else {
              // Set existing user data
              user.id = existingUser.id
              user.role = existingUser.role
              user.firstName = existingUser.firstName
              user.lastName = existingUser.lastName
              user.department = existingUser.department
              user.designation = existingUser.designation
              user.profilePhoto = existingUser.profilePhoto
            }
          }
        } catch (error) {
          console.error("Error handling OAuth sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // First time JWT callback is run, user object is available
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.department = user.department
        token.designation = user.designation
        token.profilePhoto = user.profilePhoto
      } else if (token.sub) {
        // Subsequent calls, refresh user data from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              role: true,
              firstName: true,
              lastName: true,
              department: true,
              designation: true,
              profilePhoto: true,
              email: true,
            }
          })
          
          if (dbUser) {
            token.role = dbUser.role
            token.firstName = dbUser.firstName
            token.lastName = dbUser.lastName
            token.department = dbUser.department
            token.designation = dbUser.designation
            token.profilePhoto = dbUser.profilePhoto
            token.email = dbUser.email
          }
        } catch (error) {
          console.error("Error refreshing user data:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.department = token.department as string | null
        session.user.designation = token.designation as string | null
        session.user.profilePhoto = token.profilePhoto as string | null
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider || 'credentials'}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
}
