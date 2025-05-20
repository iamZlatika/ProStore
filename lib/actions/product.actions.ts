'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import type { TAllItemsRequest, TInsertProduct, TUpdateProduct } from '@/types';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
  });
}

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  // category,
}: TAllItemsRequest) {
  const where = query
    ? {
        name: {
          contains: query,
          mode: 'insensitive' as const,
        },
      }
    : undefined;
  const data = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({ where });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// export async function getAllProducts({
//   query,
//   limit = PAGE_SIZE,
//   page,
//   category,
//   price,
//   rating,
//   sort,
// }: {
//   query: string;
//   limit?: number;
//   page: number;
//   category?: string;
//   price?: string;
//   rating?: string;
//   sort?: string;
// }) {
//   const where: Prisma.ProductWhereInput = {
//     ...(query
//       ? {
//           name: {
//             contains: query,
//             mode: 'insensitive',
//           },
//         }
//       : {}),
//     ...(category ? { category } : {}),
//     ...(price
//       ? {
//           price: {
//             gte: Number(price.split('-')[0]),
//             lte: Number(price.split('-')[1]),
//           },
//         }
//       : {}),
//     ...(rating
//       ? {
//           rating: {
//             gte: Number(rating),
//           },
//         }
//       : {}),
//   };

//   const data = await prisma.product.findMany({
//     where,
//     orderBy:
//       sort === 'lowest'
//         ? { price: 'asc' }
//         : sort === 'highest'
//         ? { price: 'desc' }
//         : sort === 'rating'
//         ? { rating: 'desc' }
//         : { createdAt: 'desc' },
//     skip: (page - 1) * limit,
//     take: limit,
//   });

//   const dataCount = await prisma.product.count({ where });

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   };
// }

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });
    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');

    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createProduct(data: TInsertProduct) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: product,
    });

    revalidatePath('/admin/products');
    return { success: true, message: 'Product created successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(data: TUpdateProduct) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');
    return { success: true, message: 'Product updated successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });
  return data;
}

export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}
