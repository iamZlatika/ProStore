"use server";

import { TCartItem } from "@/types";
import { cookies } from "next/headers";
import { calcPrice, convertToPlainObject, formatError, } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";


export async function addItemToCart(data: TCartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      await prisma.cart.create({
        data: newCart,
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const existItem = (cart.items as TCartItem[]).find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existItem) {
        if (product.stock < existItem.quantity + 1) {
          throw new Error("Not enouth stock");
        }
        existItem.quantity += 1;
      } else {
        if (product.stock < 1) throw new Error("Not enouth stock");
        cart.items.push(item);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as TCartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as TCartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const existItem = (cart.items as TCartItem[]).find(
      (cartItem) => cartItem.productId === productId
    );

    if (!existItem) throw new Error("Item not found");

    if (existItem.quantity === 1) {
      cart.items = (cart.items as TCartItem[]).filter(
        (cartItem) => cartItem.productId !== existItem.productId
      );
    } else {
      (cart.items as TCartItem[]).find(
        (cartItem) => cartItem.productId === productId
      )!.quantity = existItem.quantity - 1;
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as TCartItem[]),
      },
    });

    revalidatePath(`/product?${product.slug}`);
    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
