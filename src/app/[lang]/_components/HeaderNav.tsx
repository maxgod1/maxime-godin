"use client";

import DarkModeToggle from "./DarkModeToggle";
import LanguageSelect from "./LanguageSelect";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useContext } from "react";
import { GlobalContext } from "../providers";
import Link from "next/link";

const HeaderNav = () => {
  const { strings, lang } = useContext(GlobalContext);

  const path = usePathname().split(lang)[1] || "/";
  const links = [
    { href: "/", label: strings.me, color: "bg-sky-300 dark:bg-sky-700", colorbg: "sky" },
    { href: "/projects", label: strings.projects, color: "bg-teal-300 dark:bg-teal-700", colorbg: "teal" },
    { href: "/stack", label: strings.stack, color: "bg-green-300 dark:bg-green-700", colorbg: "green" },
  ];

  return (
    <header
      className={`lg:h-[50px] h-[100px] lg:min-w-[800px] min-w-0 lg:max-w-[calc(100vw-30px)] w-full 
      lg:w-[800px] bg-white/50 dark:bg-slate-950/30
      lg:rounded-full rounded-0 mx-auto absolute left-1/2 -translate-x-1/2 lg:top-5 bottom-0 z-40 backdrop-blur 
      flex-none transition-colors duration-500 lg:z-50 supports-backdrop-blur:bg-white/95 supports-backdrop-blur:bg-slate-950/95 px-3`}
    >
      <nav className="w-full flex items-center h-full">
        <ul className="w-full flex items-center lg:justify-between gap-3 justify-center flex-wrap rounded">
          <li className="flex items-center gap-5">
            {links.map(({ href, label, color }) => {
              const selected = (path || "/") === href;
              return (
                <div key={href} className={!selected ? "hover:opacity-50 transition-opacity duration-500" : ""}>
                  <Link href={`/${lang}/${href}`} className="relative py-1">
                    {selected ? (
                      <motion.div
                        // t={{ delay: 200 }}
                        layoutId="highlight"
                        className={`${color} transition-colors absolute top-0 w-full h-full lg:rounded-full rounded-xl dark:bg-opacity-80 bg-opacity-80 -z-10`}
                      />
                    ) : null}
                    <span className="px-3 text-md font-semibold">{label}</span>
                  </Link>
                </div>
              );
            })}
          </li>

          <li className="lg:w-0 w-full ">
            <div className="flex w-full max-w-[1000px]">
              <div className="h-[3px] w-1/4 bg-gradient-to-r  to-black/20 from-black/0 dark:to-white/20 dark:from-white/0" />
              <div className="h-[3px] w-2/4 bg-black/20 dark:bg-white/20" />
              <div className="h-[3px] w-1/4 bg-gradient-to-r  from-black/20 to-black/0 dark:from-white/20 dark:to-white/0" />
            </div>
          </li>
          <li className=" items-center justify-center px-2 flex lg:gap-1 gap-3">
            <LanguageSelect />
            <DarkModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderNav;
