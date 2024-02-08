"use client";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import { motion } from "framer-motion";

export default function Stack() {
  const { theme, strings } = useContext(GlobalContext);
  const initial = { scale: 0, opacity: 0 };
  const animate = { opacity: 1, scale: 1, transition: { duration: 0.5 } };
  const logos = ["nextjs", "vercel", "tailwindcss", "supabase", "mongodb", "typescript", "expo", "stripe", "shadcn:ui"];
  return (
    <div className="flex flex-col items-center mx-auto max-w-[1200px] w-full">
      <p className="lg:text-3xl text-2xl font-bold mb-10 mt-10 px-4 text-center fade-in duration-500">{strings.the_tech_i_use}</p>
      <div className="flex flex-wrap items-center justify-center lg:gap-24 gap-14 lg:px-2 px-3 pt-14 w-fit mx-auto">
        {logos.map((l) => (
          <motion.div key={l} initial={initial} animate={animate} className=" relative lg:w-[200px] lg:h-[50px] w-[100px] h-[30px]">
            <Image
              blurDataURL={`/images/${l}-${theme}.png`}
              key={l + theme}
              style={{ objectFit: "contain" }}
              src={`/images/${l}-${theme}.png`}
              fill
              alt={l + theme}
              placeholder="blur"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
