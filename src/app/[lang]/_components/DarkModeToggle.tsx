"use client";

import React, { useContext, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { setThemeCookie } from "../../../actions/cookieActions";
import { GlobalContext } from "../providers";

const DarkModeToggle = () => {
  const { theme: initTheme, strings } = useContext(GlobalContext);

  const [theme, setTheme] = useState(initTheme);
  const isDark = theme === "dark";

  const handleChange = () => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
    setThemeCookie(isDark ? "light" : "dark");
  };

  const Icon = isDark ? MoonIcon : SunIcon;

  return (
    <div className="fade-in relative flex flex-col lg:items-end w-full ">
      <div className="text  text-gray-700 dark:text-gray-200  w-full justify-end flex">
        <label className="relative inline-flex items-center  cursor-pointer">
          <input type="checkbox" value={theme} className="sr-only peer w-14" checked={isDark} onChange={handleChange} />
          <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">{strings[isDark ? "dark" : "light"]}</span>
          <div
            className={`relative flex items-center px-[4px] ${isDark ? "justify-start" : "justify-end"} w-12 h-6 
            bg-white  bg-opacity-50 rounded-full
            dark:bg-gray-600 dark:bg-opacity-50 dark:border-gray-600
            peer-checked:after:translate-x-6 rtl:peer-checked:after:-translate-x-full peer-checked:border-gray-200
            after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:dark:bg-slate-800 after:bg-opacity-75 after:dark:bg-opacity-75  after:shadow after:border-opacity-700 after:rounded-full after:h-5 after:w-5 after:transition-all
            `}
          >
            <Icon className="w-4 h-4" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default DarkModeToggle;
