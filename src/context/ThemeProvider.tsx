import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type ThemeContextType = {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
};

const ThemeContext = createContext<ThemeContextType>({
  selected: "light",
  setSelected: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", selected);

    if (selected === "light") {
      document.body.className = "bg-white text-slate-900";
    } else {
      document.body.className = "bg-dark-1 text-white";
    }
  }, [selected]);

  return (
    <ThemeContext.Provider value={{ selected, setSelected }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
