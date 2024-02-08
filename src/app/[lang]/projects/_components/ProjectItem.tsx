// app/banner.js
"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { LanguageStrings } from "../../../../types/countries";
import { Project } from "../../../../types/project";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "../../providers";
import Link from "next/link";
import { useIsVisible } from "../../../../hooks/ElementVisible";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function ProjectItem({ data, index }: { data: Project; index: number }) {
  const { title, description, image, link, videoLink, stackLogos, tags } = data;
  const { lang, strings } = useContext(GlobalContext);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 + index * 0.1 } },
  };

  return (
    <motion.div
      ref={ref}
      key={title}
      variants={variants}
      initial="hidden"
      animate={controls}
      className=" max-w-[800px] lg:min-w-[800px] min-w-[200px] flex lg:flex-row flex-col-reverse gap-4 px-3 py-4"
    >
      <div className="lg:w-1/3 h-52 relative lg:-mt-2 mt-4">
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <Image
            blurDataURL="/images/projects/blur.png"
            className="lg:px-3 hover:opacity-5 drop-shadow-md hover:drop-shadow-lg transition-all hover:scale-105 cursor-pointer"
            alt={image}
            src={`/images/projects/${image}`}
            fill
            style={{ objectFit: "contain" }}
            placeholder="blur"
          />
          <div className="lg:hidden absolute flex w-full items-center justify-center -bottom-7 gap-2">
            <span className="text-sm">{strings.visit}</span> <ArrowUpCircleIcon className="w-5" />
          </div>
          <div
            className="flex items-center justify-center absolute bottom-0 right-0 top-0 lef-0  w-full rounded-2xl duration-500
            lg:hover:backdrop-blur lg:hover:text-black lg:hover:dark:text-white lg:hover:dark:bg-slate-950/60 lg:hover:bg-white/60
            text-transparent transition-all bg-white/0 supports-backdrop-blur:bg-white/60 sdark:upports-backdrop-blur:bg-slate-950/60
            "
          >
            <span className="text-center">{link}</span>
          </div>
        </Link>
      </div>
      <div className="lg:w-2/3 relative pl-3">
        <p className="text-xl font-black mb-2">{data.title}</p>
        <p className="text-md font-black mb-2">{data.subtitle}</p>
        <p className="whitespace-pre-wrap text-sm">{data.description[lang]}</p>
        <div className="flex gap-2 flex-wrap mt-3">
          {tags.map((t) => (
            <span key={t} className="rounded bg-white/60 dark:bg-slate-950/40 px-1 text-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
