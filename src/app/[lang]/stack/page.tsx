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
      <p className="text-3xl font-bold mb-10 lg:mt-10 px-2 text-center">{strings.the_tech_i_use}</p>
      <div className="flex flex-wrap items-center justify-center gap-24 px-2 py-14 w-fit mx-auto">
        {logos.map((l) => (
          <motion.div key={l} initial={initial} animate={animate} className=" relative w-[200px] h-[50px]">
            <Image key={l + theme} style={{ objectFit: "contain" }} src={`/images/${l}-${theme}.png`} fill alt={l + theme} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
