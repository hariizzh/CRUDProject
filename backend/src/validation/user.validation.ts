import { z } from "zod";

export const UserSchema = z.object({
    name: z.string().min(1).max(50),
    username: z.string().min(3).max(20),
    city: z.string(),
    status: z.string(),
    addTime: z.string().date().optional(),
});