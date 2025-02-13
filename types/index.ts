import { insertProductSchema } from "@/lib/validators";
import { z } from "zod";

export type TProduct = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: number;
  createdAt: Date;
};
