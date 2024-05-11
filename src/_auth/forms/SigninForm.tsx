import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { signInSchema } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import {
  checkSession,
  signOutAccount,
  updateVerification,
} from "@/lib/appwrite/api";

// Define the type or shape of our object (Signin form data)
type SignInFormData = z.infer<typeof signInSchema>;

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: signInAccount, isPending: isSigningInUser } =
    useSignInAccount();

  // Handler
  const handleSignin = async (user: SignInFormData) => {
    try {
      const existingSession = await checkSession();

      if (existingSession) {
        // delete the existing session
        await signOutAccount();
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      console.log(session);

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });

        return;
      }
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

  // Texts
  //const textStyle = theme === "light" ? "text-dark" : "text-dark";

  const location = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    // Parse the URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (userId && secret) {
      // Call your API function to verify the email
      updateVerification(userId, secret)
        .then(() => {
          // Redirect to the home page after successful verification
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          toast({ title: "Login failed. Please try again." });
        });
    }
  }, [location, navigate]);

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/src/assets/images/logo10.png" alt="logo" width="200px" />

        <h2 className="h3-bold md:h2-bold pt-3 sm:pt-2 mt-[-20px] leading-normal">
          Connectez-vous
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Content de vous avoir. Veuillez entrer vos coordonnées
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4"
        >
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
            {isSigningInUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Chargement...
              </div>
            ) : (
              "Se connecter"
            )}
          </Button>

          <p
            className={`text-small-regular  text-center mt-2 ${
              theme === "dark" ? "text-light-2" : "text-light-3"
            }`}
          >
            Vous n'avez pas de compte?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
