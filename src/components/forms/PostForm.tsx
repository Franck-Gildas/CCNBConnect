import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { postSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import FileUploader from "../shared/FileUploader";
import Loader from "../shared/Loader";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { BsChevronDown } from "react-icons/bs";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

type PostFormData = z.infer<typeof postSchema>;

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
      category: post ? post.category : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: PostFormData) => {
    try {
      if (action === "Update") {
        // ACTION = UPDATE
        const updatedPost = await updatePost({
          ...value,
          postId: post?.$id || "",
          imageId: post?.imageId,
          imageUrl: post?.imageUrl,
        });

        if (!updatedPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        } else {
          navigate(`/posts/${post?.$id}`);
        }
      } else {
        // ACTION = CREATE
        const newPost = await createPost({
          ...value,
          userId: user.id,
          category: value.category, // Include the selected category
        });

        if (!newPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      // Handle any other errors (e.g., network issues, validation errors)
      toast({
        title: `${action} post failed. Please try again.`,
      });
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`${
                  theme === "light"
                    ? "shad-form_label_dark font-bold"
                    : "shad-form_label"
                }`}
              >
                Caption
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

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`${
                  theme === "light"
                    ? "shad-form_label_dark font-bold"
                    : "shad-form_label"
                }`}
              >
                Add Photos
              </FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`${
                  theme === "light"
                    ? "shad-form_label_dark font-bold"
                    : "shad-form_label"
                }`}
              >
                Add Location
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`${
                  theme === "light"
                    ? "shad-form_label_dark font-bold"
                    : "shad-form_label"
                }`}
              >
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input text-white"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`${
                  theme === "light"
                    ? "shad-form_label_dark font-bold"
                    : "shad-form_label"
                }`}
              >
                Select Category
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <select
                    className="flex w-full p-2.5 text-gray-200 bg-dark-4 border-none rounded-md shadow-sm appearance-none focus:border-indigo-600 transition duration-200 ease-in-out cursor-pointer hover:bg-dark-3 focus:outline-none"
                    {...field}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="General">General</option>
                    <option value="Events">Events</option>
                    <option value="Good and services">Good and services</option>
                    <option value="News">News</option>
                    <option value="Activities">Activities</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <BsChevronDown color="white" />
                  </div>
                </div>
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
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
