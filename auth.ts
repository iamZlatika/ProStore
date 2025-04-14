import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { calcPrice } from "./lib/utils";
import { TCartItem } from "./types";

type TSession = {
  session: Session;
  user: AdapterUser;
  trigger?: "update" | "signIn";
  token: JWT;
};

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role as "admin" | "user" | undefined,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: TSession) {
      if (session.user?.id) {
        return session;
      }
      session.user = session.user || {};
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get("sessionCartId")?.value;

        if (sessionCartId) {
          const guestCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          const userCart = await prisma.cart.findFirst({
            where: { userId: user.id },
          });

          if (guestCart) {
            const guestItems = guestCart.items as TCartItem[];
            if (userCart) {
              const userItems = userCart.items as TCartItem[];

              const mergedMap = new Map<string, TCartItem>();

              userItems.forEach((item) => {
                mergedMap.set(item.productId, { ...item });
              });

              guestItems.forEach((item) => {
                if (mergedMap.has(item.productId)) {
                  const existing = mergedMap.get(item.productId)!;
                  mergedMap.set(item.productId, {
                    ...existing,
                    quantity: existing.quantity + item.quantity,
                    price: existing.price + item.price,
                  });
                } else {
                  mergedMap.set(item.productId, { ...item });
                }
              });

              const mergedItems = Array.from(mergedMap.values());

              const { itemsPrice, totalPrice, shippingPrice, taxPrice } =
                calcPrice(mergedItems);

              await prisma.cart.update({
                where: { id: userCart.id },
                data: {
                  items: mergedItems,
                  itemsPrice,
                  totalPrice,
                  shippingPrice,
                  taxPrice,
                },
              });

              await prisma.cart.delete({
                where: { id: guestCart.id },
              });
            } else {
              await prisma.cart.update({
                where: { id: guestCart.id },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }

      return token;
    },
    authorized({
      request,
      auth,
    }: {
      request: NextRequest;
      auth: Session | null;
    }) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/user\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;
      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        console.log(11212);
        return false;
      }

      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
