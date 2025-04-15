import {
  cartItemSchema,
  insertCartSchema,
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
