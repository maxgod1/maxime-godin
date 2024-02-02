// app/banner.js
"use client";

import { Education } from "../../../types/education";
import { useContext, useRef } from "react";
import { GlobalContext } from "../providers";
import { useIsVisible } from "../../../hooks/ElementVisible";

export default function EducationItem({ data }: { data: Education }) {
  const { name, dates, location, description, link } = data || {};
  const ref = useRef(null);

  const { lang } = useContext(GlobalContext);
  const isVisible = useIsVisible(ref);

  const startDate = dates?.[0].toLocaleDateString("en-us", { year: "numeric", month: "short" });
  const endDate = dates?.[1]?.toLocaleDateString("en-us", { year: "numeric", month: "short" }) || "current";

  return (
    <div className="flex items-center w-full relative">
      <div className="h-[2px] w-[12px] bg-gradient-to-r from-black/20 to-black/70 dark:from-white/20 dark:to-white/70" />
      <div className={`px-[8px]  w-full relative`}>
        <div className="h-full absolute left-0 rounded-sm w-[2px] pt-[7px] pb-[6px]">
          <div className="h-full w-full left-0 rounded-sm bg-black/70 dark:bg-white/70" />
        </div>
        <div
          className={`transition-all ease-in duration-700 
          ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
          ref={ref}
        >
          <p className="text-2xl font-bold">{name}</p>
          <p className="text-lg ">{description?.[lang]}</p>
          <p className="text font-light">
            {startDate}・{endDate}
          </p>
        </div>
      </div>
    </div>
  );
}
