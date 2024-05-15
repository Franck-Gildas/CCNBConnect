import { z } from "zod";

// Sign-up schema validation
export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Le nom comporte au moins 3 caractères." }),
  username: z.string().min(3, {
    message: "le nom d'utilisateur doit contenir au moins 3 caractères.",
  }),
  email: z
    .string()
    .email("Adresse e-mail invalide.")
    .refine(
      (value) => value.endsWith("@monccnb.ca"),
      "Le courriel doit se terminer par @monccnb.ca"
    ),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères."),
});

// Sign-in schema validation
export const signInSchema = z.object({
  email: z
    .string()
    .email("Adresse e-mail invalide.")
    .refine(
      (value) => value.endsWith("@monccnb.ca"),
      "Le courriel doit se terminer par @monccnb.ca"
    ),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères."),
});

// Profile
export const profileSchema = z.object({
  file: z.custom<File[]>(),
  name: z
    .string()
    .min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit comporter au moins 2 caractères.",
  }),
  email: z.string().email(),
  bio: z.string(),
});

// Post
export const postSchema = z.object({
  caption: z
    .string()
    .min(5, { message: "Minimum 5 caractères." })
    .max(2200, { message: "Maximum 2,200 caractères." }),
  file: z.custom<File[]>(),
  location: z
    .string()
    .min(1, { message: "Ce champ est obligatoire." })
    .max(1000, { message: "Maximum 1000 caractères." }),
  tags: z.string(),
  category: z.string(),
});
