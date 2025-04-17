import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  paymentMethodSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

export type TProduct = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

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
