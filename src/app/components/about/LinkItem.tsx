// app/banner.js
"use client";

import { useContext, useRef } from "react";
import { GlobalContext } from "../../providers/GlobalProvider";
import { useIsVisible } from "../../../hooks/ElementVisible";
import { ResumeLink } from "../../../types/link";
import Link from "next/link";
import { LinkIcon } from "@heroicons/react/24/solid";

export default function LinkData({ data }: { data: ResumeLink }) {
  const { title, link } = data || {};
  const ref = useRef(null);

  const { lang } = useContext(GlobalContext);
  const isVisible = useIsVisible(ref);

  return (
    <div className="flex items-center w-full relative">
      <div className="h-[2px] w-[12px] bg-gradient-to-r from-black/20 to-black/70 dark:from-white/20 dark:to-white/70" />
      <div className={`px-[8px]  w-full relative`}>
        <div className="h-full absolute left-0 rounded-sm w-[1px] pt-[2px] pb-[3px]">
          <div className="h-full w-full left-0 rounded-sm bg-black/70 dark:bg-white/70" />
        </div>
        <div
          className={`transition-all ease-in-out duration-500
          ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
          ref={ref}
        >
          <Link href={link} className="flex gap-2 items-center" target="_blank" rel="noopener noreferrer">
            <span className="italic">
              <LinkIcon className="h-4 w-4 inline mr-1" />
              {title[lang]}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
