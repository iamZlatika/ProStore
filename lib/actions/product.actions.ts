"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { TProductsRequest } from "@/types";

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
  });
}
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: TProductsRequest) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
