"use client";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function SeeMoreButton({ name }: { name: string }) {
  const { setAnimatePagePath, duration, lang, strings } = useContext(GlobalContext);
  const router = useRouter();
  // const navigate = (path: string) => {
  //   setTimeout(() => router.push(`/${lang}/${path}`), duration * 1000);
  //   setAnimatePagePath(path);
  // };

  return (
    <Link
      href={`${lang}/${name}`}
      // onClick={(e) => {
      //   e.preventDefault();
      //   navigate("/projects");
      // }}
    >
      <button
        className={
          "py-2 px-4 no-underline flex items-center gap-2  rounded-md border bg-white bg-opacity-50 dark:bg-opacity-35 transition-all hover:gap-3 hover:pr-3"
        }
      >
        <span>{strings[`see_${name}`]}</span>
        <ArrowRightCircleIcon className="h-6 w-6 inline-block" />
      </button>
    </Link>
  );
}
