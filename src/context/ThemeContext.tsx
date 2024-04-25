// import React, { createContext } from "react";

// // const ThemeContext = createContext("light");

// const ThemeContext = createContext<{
//   theme: string;
//   setTheme: React.Dispatch<React.SetStateAction<string>>;
// }>({
//   theme: "light",
//   setTheme: () => {},
// });

// export default ThemeContext;

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Create a context for the theme
interface ThemeContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

// Create a provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Use a function to lazily initialize the theme state from local storage
  const [theme, setTheme] = useState<string>(() => {
    return window.localStorage.getItem("theme") || "light";
  });

  // Use an effect to update local storage whenever the theme state changes
  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  // Update the CSS variables when the theme changes
  //   useEffect(() => {
  //     document.documentElement.setAttribute("data-theme", theme);
  //   }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
