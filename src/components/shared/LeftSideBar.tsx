import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useContext, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { ThemeContext } from "@/context/ThemeContext";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  //console.log(selected);

  // Use the selected theme to apply different styles
  const backgroundColor = theme === "light" ? "bg-gray-200" : "bg-dark-2";

  console.log(backgroundColor);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className={`leftsidebar ${backgroundColor}`}>
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-0 items-center justify-start">
          <img
            src="/src/assets/images/logo21.png"
            alt="logo"
            width={70}
            height={30}
          />
          <h2 className="text-2xl font-bold text-custom-blue">CONNECT</h2>
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/src/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className={`${
                    theme === "dark"
                      ? "flex gap-4 items-center p-4"
                      : "flex gap-4 items-center p-4 base-semibold"
                  }`}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost mt-28"
        onClick={() => signOut()}
      >
        <img src="/src/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium ">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
