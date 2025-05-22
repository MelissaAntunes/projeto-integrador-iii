import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1),
  logo_url: z.string().min(1),
  description: z.string().min(1),
  email: z.string().min(1).email(),
  phone: z.string().min(1),
  website: z.string().min(1),
  address: z.string().min(1),
});
