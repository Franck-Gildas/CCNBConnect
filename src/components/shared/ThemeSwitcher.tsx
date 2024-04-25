import { motion } from "framer-motion";
import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

// Define the classes for the toggle buttons
const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

// The ThemeSwitcher component
const ThemeSwitcher = () => {
  //   const [selected, setSelected] = useState<string>(() => {
  //     return localStorage.getItem("theme") || "light";
  //   });

  const { theme, setTheme } = useTheme();

  // Update the body's class whenever the selected state changes
  useEffect(() => {
    // localStorage.setItem("theme", theme);

    if (theme === "light") {
      document.body.className =
        "bg-gray-50 text-slate-900 min-h-screen font-inter font-semibold";
    } else {
      document.body.className = "bg-dark-1 text-white min-h-screen font-inter";
    }
  }, [theme]);

  return (
    <div
      className={`grid h-[40px] place-content-center px-4 transition-colors ${
        theme === "light" ? "bg-white" : "bg-slate-900"
      }`}
    >
      <SliderToggle selected={theme} setSelected={setTheme} />
    </div>
  );
};

// The SliderToggle component
const SliderToggle = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (theme: string) => void;
}) => {
  return (
    <div className="relative flex w-fit items-center rounded-full">
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "light" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => {
          setSelected("light");
        }}
      >
        <FiMoon className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Light</span>
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${
          selected === "dark" ? "text-white" : "text-slate-800"
        }`}
        onClick={() => {
          setSelected("dark");
        }}
      >
        <FiSun className="relative z-10 text-lg md:text-sm" />
        <span className="relative z-10">Dark</span>
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${
          selected === "dark" ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
