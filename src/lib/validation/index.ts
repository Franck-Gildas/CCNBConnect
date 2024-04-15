import { z } from "zod";

// Sign-up schema validation
export const signUpSchema = z.object({
  name: z.string().min(3, { message: "The name is at least 3 characters" }),
  username: z
    .string()
    .min(3, { message: "username should be at least 3 characters" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Sign-in schema validation
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Profile
export const profileSchema = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// Post
export const postSchema = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
