"use client";

import _calculateAge from "../../../utils/age-calucator";
import injectVariables from "../../../utils/dictionaries/injectVariables";
import Image from "next/image";
import Button from "../Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { RefObject,  useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks/ClickOutside";

import images from "../../../database/image-data";
import { getStaticImgUrl } from "../../../utils/utils";

const meImage = getStaticImgUrl(images["me"].fileKey);
const meMobileImage = getStaticImgUrl(images["me-mobile"].fileKey);

export default function ResumeIntro({ strings }: { strings: Record<string, string> }) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[800px] lg:px-1 px-3">
      <div className="lg:hidden block w-full h-28 full relative rounded-lg overflow-hidden mb-2">
        <Image src={meMobileImage} fill alt="me" style={{ objectFit: "cover" }} />
      </div>
      <div className="flex items-center justify-start gap-3">
        <div className="lg:block hidden">
          <div className="lg:h-20 lg:w-20 w-16 h-16 relative rounded-full overflow-hidden">
            <Image src={meImage} fill alt="me" style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold">Maxime Godin</p>
          <p className="text-sm mb-1">
            {injectVariables(strings.age, { age: _calculateAge(new Date("1989/01/07")) })} • Tokyo, JP • {strings.spoken_languages}
          </p>
        </div>
      </div>
      <p className="w-full pt-3 pb-2 lg:text-lg ">{injectVariables(strings.short_description, { years: _calculateAge(new Date("2019/01/01")) })}</p>
      <div className="w-full mb-2">
        <Button
          customClass=" bg-transparent dark:bg-slate-950/0 px-0 font-light"
          title={strings.read_more}
          onClick={() => {
            modalRef.current?.showModal?.();
            setOpen(true);
          }}
        />
      </div>
      {/* <div className="py-3 flex flex-wrap gap-3">
        <Link href="/projects">
          <Button title={strings.see_projects} />
        </Link>
        <Link href="/stack">
          <Button title={strings.see_stack} />
        </Link>
      </div> */}
      <Modal
        modalRef={modalRef}
        open={open}
        setOpen={setOpen}
        description={injectVariables(strings.me_description, { years: _calculateAge(new Date("2019/01/01")) })}
      />
    </div>
  );
}

const Modal = ({
  description,
  modalRef,
  open,
  setOpen,
}: {
  description?: string;
  modalRef: RefObject<HTMLDialogElement | null>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {

  const outsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (open) {
      modalRef.current?.close?.();
      setOpen(false);
    }
  });
  return (
    <dialog
      key={description || ""}
      ref={modalRef as RefObject<HTMLDialogElement>}
      data-modal-target="modal"
      className={`${
        open ? "opacity-100 backdrop-opacity-100" : "opacity-0 backdrop-opacity-0"
      } duration-500 relative backdrop-blur max-w-screen bg-white/30 dark:bg-slate-950/30 transition-all p-4 rounded-xl very-rounded backdrop:backdrop-blur`}
    >
      <div className="max-w-[800px]" ref={outsideClickRef}>
        <div className="group-hover:opacity-50 transition-all duration-300 pt-3">
          <p className="w-full py-3 lg:text-lg ">{description}</p>
        </div>
        <div className="absolute right-2 top-2">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="outline-none"
            onClick={() => {
              modalRef?.current?.close();
              setOpen(false);
            }}
          >
            <XCircleIcon className=" w-7 h-7" />
          </button>
        </div>
      </div>
    </dialog>
  );
};
