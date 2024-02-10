"use client";
import { useContext } from "react";
import { GlobalContext } from "../providers";
import Button from "../_components/Button";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function Stack() {
  const { strings } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center mx-auto max-w-[800px] w-full">
      <p className="lg:text-3xl lg:px-0 text-xl font-bold lg:mb-8 mb-6 mt-4 px-6 text-center fade-in duration-500">{strings.contact_me}</p>
      <Link href="mailto:maxmgodin@gmail.com" target="_blank" rel="noopener noreferrer">
        <Button title={strings.contact} Icon={EnvelopeIcon} />
      </Link>
    </div>
  );
}
