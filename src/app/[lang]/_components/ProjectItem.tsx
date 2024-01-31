// app/banner.js
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LanguageStrings } from "../../../types/countries";
import { ProjectItem } from "../../../types/project";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import Link from "next/link";

export default function ProjectItem({ data, index }: { data: ProjectItem; index: number }) {
  const { title, description, image, link, videoLink, stackLogos, tags } = data;
  const { lang, strings } = useContext(GlobalContext);

  const variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 + index * 0.1 } },
  };

  return (
    <motion.div
      key={title}
      variants={variants}
      initial="initial"
      animate="animate"
      className="max-w-[800px] lg:min-w-[800px] min-w-[200px] flex lg:flex-row flex-col gap-4 rounded-lg bg-white dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-50 px-3 py-4"
    >
      <div className="lg:w-1/3 h-52 relative">
        <Link href={link}>
          <Image
            className="p-0 drop-shadow-md hover:drop-shadow-lg transition-all hover:scale-105 cursor-pointer"
            alt={image}
            src={`/images/projects/${image}`}
            fill
            style={{ objectFit: "contain" }}
          />
        </Link>
      </div>
      <div className="lg:w-2/3 relative pl-3">
        <p className="text-xl font-black mb-2">{data.title}</p>
        <p className="text-md font-black mb-2">{data.subtitle}</p>
        <p className="whitespace-pre-wrap text-sm">{data.description[lang]}</p>
        <div className="flex gap-2 flex-wrap mt-3">
          {tags.map((t) => (
            <span key={t} className="rounded bg-white bg-opacity-100 dark:bg-opacity-20 px-1 text-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
