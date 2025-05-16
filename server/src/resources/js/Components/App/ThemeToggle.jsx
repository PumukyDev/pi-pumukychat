import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "pumukyChatTheme");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "pumukyChatTheme" ? "pumukyChatLight" : "pumukyChatTheme");
    };

    const isLight = theme === "pumukyChatLight";

    return (
        <button
            onClick={toggleTheme}
            className={`w-14 h-8 flex items-center px-1 rounded-full border border-base-300 transition-colors duration-300 ${
                isLight ? "bg-yellow-300" : "bg-gray-700"
            }`}
        >
            <div
                className={`w-6 h-6 bg-base-100 rounded-full flex items-center justify-center shadow transition-all duration-300 transform ${
                    isLight ? "translate-x-6" : "translate-x-0"
                }`}
            >
                {isLight ? (
                    <Sun className="w-4 h-4 text-yellow-600" />
                ) : (
                    <Moon className="w-4 h-4 text-blue-400" />
                )}
            </div>
        </button>
    );
}
