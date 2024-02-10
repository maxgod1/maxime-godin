// app/banner.js
"use client";

import { useContext, useRef } from "react";
import { GlobalContext } from "../providers";
import { Skill } from "../../../types/skill";
import { LanguageStrings } from "../../../types/countries";
import Link from "next/link";
import Button from "./Button";
import { useIsVisible } from "../../../hooks/ElementVisible";

export default function SkillItem({ data }: { data?: Skill; index?: number }) {
  const { subSkills, links } = data || {};
  const { lang } = useContext(GlobalContext);

  return (
    <div className="px-3">
      <div className="text-xl font-bold mb-3 fade-in">{data?.[lang]}</div>
      <div className="flex gap-2 flex-wrap">
        {subSkills?.map((subSkill, index) => (
          <Subskill data={subSkill} key={subSkill[lang]} index={index} />
        ))}
      </div>
    </div>
  );
}

const Subskill = ({ data, index }: { data: Skill["subSkills"][0]; index: number }) => {
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);
  const { lang } = useContext(GlobalContext);
  const duration = (index + 1) * 100;
  console.log(duration);

  return (
    <div
      ref={ref}
      className={`bg-slate-950/20 xl:text-base lg:text-sm text-xs rounded px-2 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      }`}
    >
      <p>{data[lang]} </p>
      <p>
        {Array.from(Array(data.ranking).keys()).map(() => (
          <span>★</span>
        ))}
        {Array.from(Array(5 - data.ranking).keys()).map(() => (
          <span>☆</span>
        ))}
      </p>
    </div>
  );
};
