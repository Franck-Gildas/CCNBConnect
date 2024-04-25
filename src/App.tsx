import { Routes, Route } from "react-router-dom";
import { SigninForm, SignupForm } from "./_auth/forms";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

const App = () => {
  // Body's theme
  const themeContextValue = useContext(ThemeContext);

  if (!themeContextValue) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { theme } = themeContextValue;

  if (theme === "light") {
    document.body.className =
      "bg-gray-50 text-slate-900 min-h-screen font-inter font-semibold";
  } else {
    document.body.className = "bg-dark-1 text-white min-h-screen font-inter";
  }

  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
