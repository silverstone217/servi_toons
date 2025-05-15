import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { isEmptyString } from "./utils/functions";
import { credAuthSchema } from "./schema/authSchema";
import { compare } from "bcryptjs";
import { ZodError } from "zod";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as import("@auth/core/adapters").Adapter,
  pages: {
    signIn: "/connexion",
    verifyRequest: "/verif-email-sent",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // credentials email, password
    Credentials({
      credentials: {
        email: { label: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials.email || !credentials.password) {
            throw new Error("Veuillez remplir tous les champs!");
          }
          const email = credentials.email as string;
          const pwd = credentials.password as string;

          if (isEmptyString(email) || isEmptyString(pwd)) {
            throw new Error("Veuillez remplir tous les champs!");
          }
          const revalidated = await credAuthSchema.parse({
            email,
            password: pwd,
          });
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            throw new Error("Utilisateur non trouvé !");
          }

          if (!user.password) {
            throw new Error(
              "Ce compte n'a pas de mot de passe défini. Veuillez utiliser un autre moyen de connexion."
            );
          }

          const passwordMatch = await compare(
            revalidated.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Email ou mot de passe incorrect !");
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pass, ...rest } = user;

          return rest;
        } catch (error) {
          if (error instanceof ZodError) {
            // Formatter les erreurs de Zod en une chaîne de caractères avec chaque erreur sur une nouvelle ligne
            const errorMessages = error.errors
              .map((err) => err.message)
              .join("\n");
            throw new Error(errorMessages);
          } else {
            const errorMessage = (error as Error).message;
            throw new Error(errorMessage);
          }
        }
      },
    }),

    // google
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.SECRET_KEY,
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        const tokenId = token.sub;
        if (tokenId) {
          const user = await prisma.user.findUnique({
            where: {
              id: tokenId,
            },
          });
          if (user) {
            session.user = {
              id: user.id,
              name: user.name,
              email: user.email ? user.email : "",
              emailVerified: user.emailVerified,
              image: user.image,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              isBanned: user.isBanned,
            };
          }
        }
      }
      return session;
    },
  },
});
