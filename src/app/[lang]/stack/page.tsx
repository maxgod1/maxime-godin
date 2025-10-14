"use client";
import Image from "next/image";
import { useContext } from "react";
import { GlobalContext } from "../../providers/GlobalProvider";
import { motion } from "framer-motion";

import images from "../../../database/image-data";
import { getStaticImgUrl } from "../../../utils/utils";

const nextjsDark = images["nextjs-dark"];
const nextjsLight = images["nextjs-light"];
const vercelDark = images["vercel-dark"];
const vercelLight = images["vercel-light"];
const tailwindcssDark = images["tailwindcss-dark"];
const tailwindcssLight = images["tailwindcss-light"];
const supabaseDark = images["supabase-dark"];
const supabaseLight = images["supabase-light"];

const typescriptDark = images["typescript-dark"];
const typescriptLight = images["typescript-light"];
const expoDark = images["expo-dark"];
const expoLight = images["expo-light"];
const stripeDark = images["stripe-dark"];
const stripeLight = images["stripe-light"];
const shadcnDark = images["shadcn:ui-dark"];
const shadcnLight = images["shadcn:ui-light"];
const convexDark = images["convex-dark"];
const convexLight = images["convex-light"];

export default function Stack() {
  const { theme, strings } = useContext(GlobalContext);
  const initial = { scale: 0, opacity: 0 };
  const animate = { opacity: 1, scale: 1, transition: { duration: 0.5 } };
  const logosDark = [nextjsDark, vercelDark, tailwindcssDark, convexDark, supabaseDark, typescriptDark, expoDark, stripeDark, shadcnDark];
  const logosLight = [nextjsLight, vercelLight, tailwindcssLight, convexLight, supabaseLight, typescriptLight, expoLight, stripeLight, shadcnLight];
  return (
    <div className="flex flex-col items-center mx-auto max-w-[1200px] w-full">
      <p className="lg:text-3xl lg:px-0 text-2xl font-bold lg:mb-8 mb-4 mt-10 px-6 text-center fade-in duration-500">{strings.the_tech_i_use}</p>
      <div className="flex flex-wrap items-center justify-center lg:gap-24 gap-14 lg:px-2 px-3 pt-14 w-fit mx-auto">
        {(theme === "dark" ? logosDark : logosLight).map((l) => (
          <motion.div key={l.title + theme} initial={initial} animate={animate} className=" relative lg:w-[200px] lg:h-[50px] w-[100px] h-[30px]">
            <Image key={l.title + theme} style={{ objectFit: "contain" }} src={getStaticImgUrl(l.fileKey)} fill alt={l.title + theme} priority={true} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
