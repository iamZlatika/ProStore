import type {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  paymentMethodSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProductSchema,
  updateProfileSchema,
  updateUserSchema,
} from '@/lib/validators';
import type { z } from 'zod';

export type TProduct = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};
export type TUpdateProduct = z.infer<typeof updateProductSchema>;
export type TInsertProduct = z.infer<typeof insertProductSchema>;
export type TCart = z.infer<typeof insertCartSchema>;
export type TCartItem = z.infer<typeof cartItemSchema>;
export type TShippingAddress = z.infer<typeof shippingAddressSchema>;
export type TPaymentMethod = z.infer<typeof paymentMethodSchema>;
export type TInsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type TInsertOrder = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: TInsertOrderItem[];
  user: { name: string; email: string };
  // paymentResult: PaymentResult;
};

export type TPayPalOrderResponse = {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
};

export type TPaymentResult = z.infer<typeof paymentResultSchema>;
export type TUpdateUser = z.infer<typeof updateProfileSchema>;

export type TSalesData = {
  month: string;
  totalSales: number;
};

export type TUser = z.infer<typeof updateUserSchema>;

export type TSearchParams = {
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page: number;
  limit?: number;
};

export type TCategory = {
  category: string;
  _count: { category: number };
};
