import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "../../../lib/auth/prisma-adapter";

/**
 * Function that builds the options object used to configure NextAuth.
 *
 * @param req - The NextApiRequest or NextPageContext.req object
 * @param res - The NextApiResponse or NextPageContext.res object
 * @returns The NextAuthOptions object
 */
export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext["req"],
  res: NextApiResponse | NextPageContext["res"]
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope:
              "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar",
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: "",
            email: profile.email,
            avatar_url: profile.picture,
          };
        },
      }),
    ],
    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
        ) {
          return "/register/connect-calendar?error=permissions";
        }

        return true;
      },
      async session({ session, user }) {
        return {
          ...session,
          user,
        };
      },
    },
  };
}

/**
 * Handler function for the Next.js API route that handles authentication.
 * 
 * @param req - The NextApiRequest object
 * @param res - The NextApiResponse object
 * @returns A Promise that resolves to the response from NextAuth
 */
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res));
}
