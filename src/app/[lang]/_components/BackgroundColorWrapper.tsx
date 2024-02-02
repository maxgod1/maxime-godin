// app/template.tsx
"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../providers";

export default function BackgroundColorWrapper({ children }: { children: React.ReactNode }) {
  const { lang, animatePagePath, duration } = useContext(GlobalContext);
  const pathname = usePathname().split(lang)[1] || "/";
  const path = animatePagePath || pathname;

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

  const [on, setOn] = useState(false);

  useEffect(() => {
    let subscribed = true;

    setTimeout(() => setOn(true), 100);
    () => {
      subscribed = false;
    };
  }, [, path]);

  return (
    <div
      className={`bg-gradient-to-b to-80% ${
        pathname === "/"
          ? " from-orange-300 to-orange-100 dark:from-orange-800 dark:to-orange-950"
          : pathname === "/stack"
          ? "from-green-300 to-green-100 dark:from-green-800 dark:to-green-950"
          : pathname === "/projects"
          ? "from-blue-300 to-blue-100 dark:from-blue-800 dark:to-blue-950"
          : ""
      } transition-colors duration-1000 no-scrollbar w-screen px-auto h-screen dark:blue-800 overflow-scroll 
      bg-opacity-70 flex-col items-center justify-start lg:pt-24 lg:pb-14 pt-14 pb-44 h-view`}
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
