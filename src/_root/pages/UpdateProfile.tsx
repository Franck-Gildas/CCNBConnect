import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { ProfileUploader, Loader } from "@/components/shared";

import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useUpdateUser,
} from "@/lib/react-query/queriesAndMutation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { profileSchema } from "@/lib/validation";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof profileSchema>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  };

  // Theme
  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/src/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className={`${theme === "light" ? "invert-dark" : "invert-white"}`}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

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
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input text-white"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
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
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input text-white"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      theme === "dark"
                        ? "shad-form_label"
                        : "shad-form_label_dark base-semibold"
                    }`}
                  >
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
