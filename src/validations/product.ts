import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  category: z.string().min(3),
  createdBy: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(3),
  id: z.string().optional(),
});
export const brandSchema = z.object({
  name: z.string().min(3),
  id: z.string().optional(),
});

export type ProductInputTypes = z.infer<typeof productSchema>;
export type categoryTypes = z.infer<typeof categorySchema>;
export type brandTypes = z.infer<typeof brandSchema>;
