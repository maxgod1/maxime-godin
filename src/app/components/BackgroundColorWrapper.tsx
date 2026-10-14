// app/template.tsx
"use client";
import { usePathname } from "next/navigation";
import { useContext,  } from "react";
import { GlobalContext } from "../providers/GlobalProvider";
import { cn } from "../../utils/utils";

export default function BackgroundColorWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useContext(GlobalContext);
  const pathname = usePathname().split(lang)[1] || "/";

  if (pathname.startsWith("/regul")) {
    return (
      <div className="h-[100dvh] w-full overflow-hidden bg-white text-slate-900" style={{ colorScheme: "light" }}>
        {children}
      </div>
    );
  }

  // const variants = {
  //   initial: { opacity: 0 },
  //   animate: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: duration, delay: duration },
  //   },
  //   exit: {
  //     opacity: 0,
  //     transition: { duration: duration + 0.1 },
  //   },
  // };

  return (
    <div
      className={ cn(`${
        pathname === "/"
          ? " bg-sky-300/50  dark:bg-sky-600/50 "
          : pathname === "/projects"
          ? "bg-teal-300/50  dark:bg-teal-500/30 "
          : pathname === "/stack"
          ? "bg-green-300/50  dark:bg-green-500/30 "
          : pathname === "/contact"
          ? "bg-indigo-300/50  dark:bg-indigo-500/30 "
          : ""
      }`, 'transition-colors duration-1000 w-full px-auto dark:blue-800 bg-opacity-70 lg:pt-24 lg:pb-14 pt-5 pb-52 min-h-screen')}
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
