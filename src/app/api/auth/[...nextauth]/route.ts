import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "Tipo de usuario", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, userType } = credentials as {
          email: string
          password: string
          userType: string
        }

        // 1. Validar email y password con Supabase Auth
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError || !user) {
          console.error("Supabase sign-in error:", signInError)
          return null
        }

        // 2. Consultar info extra desde la tabla de usuarios
        const { data: userData, error: fetchError } = await supabase
          .from("usuario")
          .select("*")
          .eq("email", email)
          .single()

        if (fetchError || !userData) {
          console.error("Error al obtener datos del usuario:", fetchError)
          return null
        }

        // 3. Validar que coincida el tipo
        if (userData.tipo !== userType) {
          console.error("Tipo de usuario incorrecto")
          return null
        }

        // 4. Retornar el objeto user para usarlo en el JWT
        return {
          id: userData.id,
          email: userData.email,
          name: userData.nombre,
          userType: userData.tipo,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      session.user.userType = token.userType as string
      session.user.id = token.id as string
      session.user.name = token.name as string
      return session
    }
  },
  pages: {
    signIn: "/auth/login", // Ruta personalizada de login
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
