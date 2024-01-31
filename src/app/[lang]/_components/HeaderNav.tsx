"use client";

import DarkModeToggle from "./DarkModeToggle";
import LanguageSelect from "./LanguageSelect";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MouseEvent, useContext } from "react";
import { GlobalContext } from "../providers";
import Link from "next/link";

const HeaderNav = () => {
  const { setAnimatePagePath, animatePagePath, duration, strings, lang } = useContext(GlobalContext);
  const router = useRouter();

  const links = [
    { href: "/", label: strings.me, color: "bg-orange-300 dark:bg-orange-700", colorbg: "orange" },
    { href: "/projects", label: strings.projects, color: "bg-blue-300 dark:bg-blue-800", colorbg: "blue" },
    { href: "/stack", label: strings.stack, color: "bg-green-300 dark:bg-green-800", colorbg: "green" },
  ];
  const navigate = (path: string) => {
    setTimeout(() => router.push(`/${lang}/${path}`), duration * 1000);
    setAnimatePagePath(path);
  };

  return (
    <header
      className={`lg:h-[50px] h-[90px] lg:min-w-[800px] min-w-0 max-w-[calc(100vw-30px)] 
      w-[800px] bg-white dark:bg-opacity-30 bg-opacity-50 
      lg:rounded-full rounded-3xl mx-auto absolute left-1/2 -translate-x-1/2 top-5 z-40 backdrop-blur 
      flex-none transition-colors duration-500 lg:z-50 supports-backdrop-blur:bg-white/95 px-6`}
    >
      <nav className="w-full flex items-center h-full">
        <ul className="w-full flex items-center lg:justify-between gap-2 justify-center flex-wrap-reverse rounded">
          <li className="flex items-center gap-5 ">
            {links.map(({ href, label, color }) => {
              const selected = (animatePagePath || "/") === href;
              return (
                <div key={href} className={!selected ? "hover:opacity-50 transition-opacity duration-500" : ""}>
                  <Link
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(href);
                    }}
                    className="relative py-1"
                  >
                    {selected ? (
                      <motion.div
                        // t={{ delay: 200 }}
                        layoutId="highlight"
                        className={`${color} absolute top-0 w-full h-full lg:rounded-full rounded-xl dark:bg-opacity-80 bg-opacity-80 -z-10`}
                      />
                    ) : null}
                    <span className="px-3 text-md font-semibold">{label}</span>
                  </Link>
                </div>
              );
            })}
          </li>

          <li className="lg:w-0 w-full border-b " />
          <li className=" items-center justify-center px-2 flex">
            <LanguageSelect />
            <DarkModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderNav;
