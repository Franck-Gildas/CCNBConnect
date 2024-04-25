import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  const userNameStyle =
    theme === "light"
      ? "small-regular text-light-4 text-center line-clamp-1 "
      : "small-regular text-light-3 text-center line-clamp-1";

  const nameStyle =
    theme === "light"
      ? "base-semibold text-center line-clamp-1"
      : "base-medium text-center line-clamp-1";

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className={nameStyle}>{user.name}</p>
        <p className={userNameStyle}>@{user.username}</p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
