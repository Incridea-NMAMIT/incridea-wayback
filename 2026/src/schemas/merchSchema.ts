import { z } from "zod";

export const merchPurchaseSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  usn: z
    .string()
    .min(8, "USN must be at least 8 characters")
    .max(10, "USN must be less than 10 characters")
    .optional()
    .or(z.literal('')),
  collegeName: z
    .string()
    .min(3, "College name must be at least 3 characters")
    .max(100, "College name must be less than 100 characters"),
  size: z
    .enum(["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"], {
      message: "Please select a valid size",
    }),
  semester: z
    .string()
    .min(1, "Please select a semester")
    .max(2, "Invalid semester"),
  branch: z
    .string()
    .min(2, "Please enter a valid branch")
    .max(100, "Branch name must be less than 100 characters"),
  section: z.string().optional(),
});

export type MerchPurchaseFormData = z.infer<typeof merchPurchaseSchema>;
