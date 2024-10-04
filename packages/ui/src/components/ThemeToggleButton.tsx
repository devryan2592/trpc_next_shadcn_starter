"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
interface ThemeToggleButtonProps {
  // Define your props here
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };


  return <Button onClick={toggleTheme}>Toggle Theme</Button>;
};

export default ThemeToggleButton;
