import { Models } from "appwrite";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
// import { account } from "@/lib/appwrite/config";
// import { useNavigate } from "react-router-dom";
// import { toast } from "@/components/ui/use-toast";

const Home = () => {
  // const { toast } = useToast();

  // const navigate = useNavigate();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  // const urlParams = new URLSearchParams(window.location.search);
  // const userId = urlParams.get("userId");
  // const secret = urlParams.get("secret");

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const userId = urlParams.get("userId");
  //   const secret = urlParams.get("secret");

  //   if (userId && secret) {
  //     account
  //       .updateVerification(userId, secret)
  //       .then(() => {
  //         console.log("User is verified!");
  //         toast({ title: "User is verified!" });
  //         navigate("/");
  //       })
  //       .catch((e) => {
  //         console.log("Verification failed!", e);
  //       });
  //   }
  // }, [navigate]);

  // Theme customization
  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  const backgroundColor = theme === "light" ? "bg-gray-100" : "bg-dark-3";
  const foregroundColor = theme === "light" ? "text-dark" : "text-light-2";
  const textDarkLight = theme === "light" ? "Light" : "Dark";
  const classDarkLight =
    theme === "light" ? "md:base-semibold" : "md:base-medium";

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          {/* <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2> */}
          <div className="flex-between w-full max-w-5xl mt-2 mb-5">
            {/* <h2 className="body-bold md:h3-bold">Home Feed</h2> */}
            <h2 className="h3-bold md:h2-bold text-left w-full sm:w-auto">
              Home Feed
            </h2>

            <div
              className={`flex flex-col items-start gap-3 rounded-xl px-2 py-2 cursor-pointer ${backgroundColor}`}
            >
              <p
                className={`small-medium ${classDarkLight} ${foregroundColor}`}
              >
                {textDarkLight} Mode
              </p>
              <ThemeSwitcher />
            </div>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3
          className={`h3-bold ${
            theme === "light" ? "text-dark-3" : "text-light-1"
          } `}
        >
          Top Creators
        </h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
