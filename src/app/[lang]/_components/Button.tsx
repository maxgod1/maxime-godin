"use client";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  customClass?: string;
}

export default function Button({ title, customClass, ...rest }: Props) {
  const router = useRouter();
  return (
    <button
      className={`py-2 px-4 ease-in-out no-underline flex items-center gap-2 text-sm text-left lg:text-base rounded-md  bg-white/50 dark:bg-slate-950/30 transition-all hover:gap-3 hover:pr-3 ${customClass}`}
      {...rest}
    >
      <span>{title}</span>
      <ArrowRightCircleIcon className="lg:h-6 lg:w-6 w-5 h-5 inline-block" />
    </button>
  );
}
