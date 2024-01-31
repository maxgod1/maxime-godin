"use client";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";

export default function SeeProjectsButton() {
  const { setAnimatePagePath, duration, lang, strings } = useContext(GlobalContext);
  const router = useRouter();
  // const navigate = (path: string) => {
  //   setTimeout(() => router.push(`/${lang}/${path}`), duration * 1000);
  //   setAnimatePagePath(path);
  // };

  return (
    <Link
      href={"/projects"}
      // onClick={(e) => {
      //   e.preventDefault();
      //   navigate("/projects");
      // }}
    >
      <button
        className={"py-2 px-4 no-underline flex items-center gap-2  rounded-md border bg-white bg-opacity-50 transition-all hover:gap-3 hover:pr-3"}
      >
        <span>{strings.see_projects}</span>
        <ArrowRightCircleIcon className="h-5 w-5 inline-block" />
      </button>
    </Link>
  );
}
