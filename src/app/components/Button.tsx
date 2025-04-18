"use client";

import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  customClass?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export default function Button({ title, customClass, Icon = ArrowRightCircleIcon, ...rest }: Props) {
  return (
    <button
      className={`py-2 px-3 ease-in-out no-underline flex items-center gap-2 text-sm text-left lg:text-base rounded-md  bg-white/50 dark:bg-slate-950/30 transition-all hover:gap-3 hover:pr-2 ${customClass}`}
      {...rest}
    >
      <span>{title}</span>
      <Icon className="lg:h-6 lg:w-6 w-5 h-5 inline-block" />
    </button>
  );
}
