// app/banner.js
"use client";

import { Education } from "../../../types/education";
import { useContext, useRef } from "react";
import { GlobalContext } from "../../providers/GlobalProvider";
import { useIsVisible } from "../../../hooks/ElementVisible";
import formatDates from "../../../utils/date-calculator";

export default function EducationItem({ data }: { data: Education }) {
  const { name, dates, description } = data || {};
  const ref = useRef(null);

  const { lang } = useContext(GlobalContext);
  const isVisible = useIsVisible(ref);
  const { startDate, endDate } = formatDates(dates, lang);

  return (
    <div className="flex items-center w-full relative">
      <div className="h-[2px] w-[12px] bg-gradient-to-r from-black/20 to-black/70 dark:from-white/20 dark:to-white/70" />
      <div className={`px-[8px]  w-full relative`}>
        <div className="h-full absolute left-0 rounded-sm w-[1px] pt-[7px] pb-[6px]">
          <div className="h-full w-full left-0 rounded-sm bg-black/70 dark:bg-white/70" />
        </div>
        <div
          className={`transition-all ease-in-out duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
          ref={ref}
        >
          <span className="text-2xl font-bold">
            <span className="mr-1">{name}</span>
            <span className="text-sm font-thin italic lg:inline block">
              {" "}
              {startDate}・{endDate}
            </span>
          </span>
          <p className="text-lg ">{description?.[lang]}</p>
        </div>
      </div>
    </div>
  );
}
