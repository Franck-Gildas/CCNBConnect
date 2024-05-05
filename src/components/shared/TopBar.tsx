import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useContext, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  return (
    <section className={`${theme === "dark" ? "topbar" : "topbar_light"}`}>
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-0 items-center">
          <img
            src="/src/assets/images/logo21.png"
            alt="logo"
            width={70}
            height={320}
          />
          <h2 className="text-2xl font-bold text-custom-blue">CONNECT</h2>
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/src/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/src/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
