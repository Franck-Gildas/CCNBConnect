import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import "/src/App.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutation";

import { useUserContext } from "@/context/AuthContext";
import { signUpSchema } from "@/lib/validation";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { checkSession, signOutAccount } from "@/lib/appwrite/api";
import { account } from "@/lib/appwrite/config";

// Define the type or shape of our object (Signup form data)
type SignUpFormData = z.infer<typeof signUpSchema>;

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading: isUserLoading } = useUserContext();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
    useSignInAccount();

  // Handler
  const handleSignup = async (user: SignUpFormData) => {
    try {
      // Create User Account
      const newUser = await createUserAccount(user);

      // Check New User
      if (!newUser) {
        toast({ title: "L'inscription a échoué. Veuillez réessayer" });

        return;
      }

      const existingSession = await checkSession();

      if (existingSession) {
        // delete the existing session
        await signOutAccount();
      }

      // Sign In Account
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({
          title:
            "Quelque chose s'est mal passé. Veuillez vous connecter à votre nouveau compte",
        });

        navigate("/sign-in");

        return;
      }

      // Define the URL to which the user will be redirected after clicking the verification link
      // const verificationUrl = `http://localhost:${
      //   import.meta.env.VITE_APP_PORT
      // }/sign-in`;

      const verificationUrl = "https://ccnb-connect.vercel.app/";

      // Send verification email
      await account.createVerification(verificationUrl);

      toast({ title: "L'e-mail de vérification a été envoyé! 🚀" });

      // Check Auth User
      // const isLoggedIn = await checkAuthUser();

      // if (isLoggedIn) {
      //   form.reset();

      //   navigate("/");
      // } else {
      //   toast({ title: "Login failed. Please try again." });

      //   return;
      // }
    } catch (error) {
      console.log({ error });
    }
  };

  // Theme
  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src="/assets/images/logo10.png"
          alt="logo"
          width="200px"
          className="mb-0"
        />

        <h2 className="h3-bold md:h2-bold pt-0 sm:pt-0 mt-[-30px] leading-normal">
          Créez un nouveau compte
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-1">
          Veuillez saisir les détails de votre compte
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={`${
                    theme === "dark"
                      ? "shad-form_label"
                      : "shad-form_label_dark base-semibold"
                  }`}
                >
                  Nom
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={`${
                    theme === "dark"
                      ? "shad-form_label"
                      : "shad-form_label_dark base-semibold"
                  }`}
                >
                  Nom d'utilisateur
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={`${
                    theme === "dark"
                      ? "shad-form_label"
                      : "shad-form_label_dark base-semibold"
                  }`}
                >
                  Courriel
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={`${
                    theme === "dark"
                      ? "shad-form_label"
                      : "shad-form_label_dark base-semibold"
                  }`}
                >
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-700"
          >
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Chargement...
              </div>
            ) : (
              "S'inscrire"
            )}
          </Button>

          <p
            className={`text-small-regular  text-center mt-2 ${
              theme === "light" ? "text-light-3" : "text-light-2"
            }`}
          >
            Vous avez déjà un compte?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
