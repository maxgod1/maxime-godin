// app/banner.js
"use client";

import { useContext, useRef } from "react";
import { GlobalContext } from "../providers";
import { Skill } from "../../../types/skill";

import { useIsVisible } from "../../../hooks/ElementVisible";

export default function SkillItem({ data }: { data?: Skill; index?: number }) {
  const { subSkills } = data || {};
  const { lang } = useContext(GlobalContext);

  return (
    <div className="px-3">
      <div className="text-xl font-bold mb-3 fade-in">{data?.[lang]}</div>
      <div className="flex gap-2 flex-wrap">
        {subSkills?.map((subSkill, ) => (
          <Subskill data={subSkill} key={subSkill[lang]}  />
        ))}
      </div>
    </div>
  );
}

const Subskill = ({ data }: { data: Skill["subSkills"][0];  }) => {
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);
  const { lang } = useContext(GlobalContext);

  return (
    <div
      ref={ref}
      className={`dark:bg-slate-950/20 bg-white/20 xl:text-base lg:text-sm text-sm rounded px-2 py-1 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      }`}
    >
      <p>{data[lang]} </p>
      <p className="text-xs">
        {Array.from(Array(data.ranking).keys()).map((_i, index) => (
          <span key={index}>★</span>
        ))}
        {Array.from(Array(5 - data.ranking).keys()).map((_i, index) => (
          <span key={index}>☆</span>
        ))}
      </p>
    </div>
  );
};
