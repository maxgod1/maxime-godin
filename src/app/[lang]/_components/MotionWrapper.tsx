// app/template.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../providers";

export default function MotionWrapper({ children }: { children: React.ReactNode }) {
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
      className={` ${
        pathname === "/"
          ? " bg-orange-300 dark:bg-orange-800"
          : pathname === "/stack"
          ? "bg-green-300 dark:bg-green-800"
          : pathname === "/projects"
          ? "bg-blue-300 dark:bg-blue-800"
          : ""
      } transition-all duration-1000 no-scrollbar w-screen px-auto h-screen dark:blue-800 overflow-scroll  bg-opacity-70   flex-col items-center justify-start py-24 h-view`}
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
