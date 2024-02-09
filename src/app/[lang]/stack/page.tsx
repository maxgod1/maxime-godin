"use client";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import { motion } from "framer-motion";

import nextjsDark from "../../../../public/images/nextjs-dark.png";
import nextjsLight from "../../../../public/images/nextjs-light.png";
import vercelDark from "../../../../public/images/vercel-dark.png";
import vercelLight from "../../../../public/images/vercel-light.png";
import tailwindcssDark from "../../../../public/images/tailwindcss-dark.png";
import tailwindcssLight from "../../../../public/images/tailwindcss-light.png";
import supabaseDark from "../../../../public/images/supabase-dark.png";
import supabaseLight from "../../../../public/images/supabase-light.png";
import mongodbDark from "../../../../public/images/mongodb-dark.png";
import mongodbLight from "../../../../public/images/mongodb-light.png";
import typescriptDark from "../../../../public/images/typescript-dark.png";
import typescriptLight from "../../../../public/images/typescript-light.png";
import expoDark from "../../../../public/images/expo-dark.png";
import expoLight from "../../../../public/images/expo-light.png";
import stripeDark from "../../../../public/images/stripe-dark.png";
import stripeLight from "../../../../public/images/stripe-light.png";
import shadcnDark from "../../../../public/images/shadcn:ui-dark.png";
import shadcnLight from "../../../../public/images/shadcn:ui-light.png";

export default function Stack() {
  const { theme, strings } = useContext(GlobalContext);
  const initial = { scale: 0, opacity: 0 };
  const animate = { opacity: 1, scale: 1, transition: { duration: 0.5 } };
  const logosDark = [nextjsDark, vercelDark, tailwindcssDark, supabaseDark, mongodbDark, typescriptDark, expoDark, stripeDark, shadcnDark];
  const logosLight = [nextjsLight, vercelLight, tailwindcssLight, supabaseLight, mongodbLight, typescriptLight, expoLight, stripeLight, shadcnLight];
  return (
    <div className="flex flex-col items-center mx-auto max-w-[1200px] w-full">
      <p className="lg:text-3xl text-2xl font-bold mb-10 mt-10 px-4 text-center fade-in duration-500">{strings.the_tech_i_use}</p>
      <div className="flex flex-wrap items-center justify-center lg:gap-24 gap-14 lg:px-2 px-3 pt-14 w-fit mx-auto">
        {(theme === "dark" ? logosDark : logosLight).map((l) => (
          <motion.div key={l.src} initial={initial} animate={animate} className=" relative lg:w-[200px] lg:h-[50px] w-[100px] h-[30px]">
            <Image key={l + theme} style={{ objectFit: "contain" }} src={l} fill alt={l + theme} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
