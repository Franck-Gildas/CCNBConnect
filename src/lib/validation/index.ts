import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(3, { message: "The name is at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "username should be at least 3 characters" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default signUpSchema;
