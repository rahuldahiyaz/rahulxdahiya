declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      firstName: string
      lastName: string
    }
  }

  interface User {
    role: string
    firstName: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    firstName: string
    lastName: string
  }
}
