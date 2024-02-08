// app/template.tsx
"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../providers";

export default function BackgroundColorWrapper({ children }: { children: React.ReactNode }) {
  const { lang, duration } = useContext(GlobalContext);
  const pathname = usePathname().split(lang)[1] || "/";

  const variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: duration, delay: duration },
    },
    exit: {
      opacity: 0,
      transition: { duration: duration + 0.1 },
    },
  };

  return (
    <div
      className={`${
        pathname === "/"
          ? " bg-sky-300/50  dark:bg-sky-600/50 "
          : pathname === "/stack"
          ? "bg-green-300/50  dark:bg-green-500/30 "
          : pathname === "/projects"
          ? "bg-teal-300/50  dark:bg-teal-500/30 "
          : ""
      } transition-colors duration-1000 no-scrollbar w-screen px-auto h-screen dark:blue-800 overflow-scroll 
      bg-opacity-70 flex-col items-center justify-start lg:pt-24 lg:pb-14 pt-5 pb-52 h-view`}
    >
      {children}
      {/* <AnimatePresence mode="wait">
        {on && (
          <motion.div key={path} variants={variants} initial="initial" animate="animate" exit="exit">
            {children}
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}
