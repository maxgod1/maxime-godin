"use client";

import { useEffect, useState } from "react";

export default function Divider() {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);
  return (
    <div
      className={`flex w-full max-w-[1000px] transition-all duration-1000 ${
        rendered ? "opacity-100 translate-x-1000" : "opacity-0 -translate-x-100"
      }`}
    >
      <div className="h-[2px] lg:w-1/3 w-1/2 bg-gradient-to-r  to-white/50 from-black/0 dark:to-black/30 dark:from-black/0" />
      <div className="h-[2px] lg:w-1/3 w-1/2 bg-white/50 dark:bg-black/30" />
      <div className="h-[2px] lg:w-1/3 w-1/2 bg-gradient-to-r  from-white/50 to-black/0 dark:from-black/30 dark:to-black/0" />
    </div>
  );
}
