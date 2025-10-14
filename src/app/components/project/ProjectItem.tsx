// app/banner.js
"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { Project } from "../../../types/project";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "../../providers/GlobalProvider";
import Link from "next/link";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

import images from "../../../database/image-data";
import { getStaticImgUrl } from "../../../utils/utils";

const artemisImage = images["artemis"];
const artemisLogoImageLight = images["artemis_logo-light"];
const artemisLogoImageDark = images["artemis_logo-dark"];
const forgigsImage = images["forgigs"];
const forgigsLogoImageLight = images["forgigs_logo-light"];
const forgigsLogoImageDark = images["forgigs_logo-dark"];
const forgigsPagesLogoImageLight = images["forgigs_pages_logo-light"];
const forgigsPagesLogoImageDark = images["forgigs_pages_logo-dark"];
const tempuraImage = images["tempura"];
const tempuraLogoImageLight = images["tempura_logo-light"];
const tempuraLogoImageDark = images["tempura_logo-dark"];
const jbtcImage = images["jbtc"];
const forgigsPagesImage = images["forgigs_pages"];
const jbtcLogoImageLight = images["jbtc_logo-light"];
const jbtcLogoImageDark = images["jbtc_logo-dark"];

export default function ProjectItem({ data, index }: { data: Project; index: number; }) {
  const { title, image, link, tags, videoLink } = data;
  const { lang, strings, theme } = useContext(GlobalContext);
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

  const src = [artemisImage, forgigsImage, tempuraImage, jbtcImage, forgigsPagesImage].find((s) => s.title.includes(image));
  const logoSrc = [
    artemisLogoImageLight,
    artemisLogoImageDark,
    forgigsLogoImageLight,
    forgigsLogoImageDark,
    tempuraLogoImageLight,
    tempuraLogoImageDark,
    jbtcLogoImageLight,
    jbtcLogoImageDark,
    forgigsPagesLogoImageLight,
    forgigsPagesLogoImageDark
  ].find((s) => s.title.includes(theme) && s.title.includes(image) && s.title.includes("logo"));


  return (
    <motion.div
      ref={ref}
      key={title}
      variants={variants}
      initial="hidden"
      animate={controls}
      className=" max-w-[800px] lg:min-w-[800px] min-w-[200px] flex lg:flex-row flex-col items-strech gap-4 lg:px-3 px-1 py-4 relative"
    >
      <div className="lg:w-2/3 relative pl-3">
        <div className="flex gap-2 items-center mb-2">
          {logoSrc && (
            <div className="h-[50px] w-[50px] relative rounded-lg overflow-hidden">
              <Image
                // blurDataURL={source}
                className=""
                alt={image}
                src={getStaticImgUrl(logoSrc.fileKey)}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-xl font-black">{data.title}</p>
            <p className="text-md font-black">{data.subtitle?.[lang]}</p>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-sm">{data.description[lang]}</p>
        <div className="flex gap-2 flex-wrap mt-3">
          {tags.map((t) => (
            <span key={t} className="rounded bg-white/60 dark:bg-slate-950/40 px-1 text-sm">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className={`flex flex-col`}>
        <div className="w-[2px] h-1/3 bg-gradient-to-b  to-white/50 from-black/0 dark:to-black/30 dark:from-black/0" />
        <div className="w-[2px] h-1/3 bg-white/50 dark:bg-black/30" />
        <div className="w-[2px] h-1/3 bg-gradient-to-b  from-white/50 to-black/0 dark:from-black/30 dark:to-black/0" />
      </div>
      <div className="lg:w-1/3 relative lg:-mt-2 mt-4 flex items-center">
        <div className="h-52 w-full relative">
          <Link href={link || videoLink || ""} target="_blank" rel="noopener noreferrer">
            {src && (
              <Image
                // blurDataURL={source}
                className="lg:px-3 hover:opacity-5 drop-shadow-md hover:drop-shadow-lg transition-all hover:scale-105 cursor-pointer"
                alt={image}
                src={getStaticImgUrl(src.fileKey)}
                fill
                style={{ objectFit: "contain" }}
                priority={true}
              />
            )}
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
      </div>
    </motion.div>
  );
}
