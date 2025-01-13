// app/banner.js
"use client";

import { Experience, PositionType } from "../../../types/experience";
import { RefObject, useContext, useRef, useState } from "react";
import { GlobalContext } from "../../providers/GlobalProvider";
import { useIsVisible } from "../../../hooks/ElementVisible";
import Button from "../Button";
import { MapPinIcon, XCircleIcon } from "@heroicons/react/24/outline";
import min from "lodash/min";
import max from "lodash/max";
import { useOutsideClick } from "../../../hooks/ClickOutside";
import formatDates from "../../../utils/date-calculator";
import Link from "next/link";

export default function ExperienceItem({ data }: { data?: Experience; }) {
  const { companyName,  title, dates, positions, location, description,  } = data || {};
  const ref = useRef(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const isVisible = useIsVisible(ref);
  const { lang, strings } = useContext(GlobalContext);
  const { startDate, endDate } = formatDates(
    [min(positions?.map((p) => p.dates[0])) || dates?.[0], max(positions?.map((p) => p.dates[1])) || dates?.[1]],
    lang
  );
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center w-full relative">
        <div className="h-[2px] w-[12px] bg-gradient-to-r from-black/20 to-black/70 dark:from-white/20 dark:to-white/70" />
        <div className={`px-[8px]  w-full relative`}>
          <div className="h-full absolute left-0 rounded-sm w-[1px] pt-[7px] pb-[6px]">
            <div className="h-full w-full left-0 rounded-sm bg-black/70 dark:bg-white/70" />
          </div>
          <div
            className={`${description ? "group cursor-pointer" : ""}`}
            onClick={() => {
              if (description) {
                modalRef.current?.showModal?.();
                setOpen(true);
              }
            }}
          >
            <div
              className={`transition-all ease-in-out duration-500 flex lg:flex-row  flex-col lg:items-center justify-between
          ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
              ref={ref}
            >
              <div className={`group-hover:opacity-50 transition-all duration-300`}>
                <p className="text-2xl font-bold">
                  {companyName}
                  <span className="text-sm font-thin italic ml-2">
                    {" "}
                    {startDate}・{endDate}
                  </span>
                </p>
                {title && <p className="text-lg ">{title?.[lang]}</p>}
                {location && (
                  <div className="flex justify-start items-end mb-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-xs">{location?.[lang]}</span>
                  </div>
                )}
              </div>
              {description && (
                <div
                  onClick={() => {
                    modalRef.current?.showModal?.();
                    setOpen(true);
                  }}
                  className="group-hover:opacity-100 group-hover:block  group-hover:translate-x-0 lg:opacity-0 lg:my-0 my-1"
                >
                  <Button customClass="bg-" title={strings.read_more} />
                </div>
              )}
            </div>
            {positions?.map((p, i) => (
              <Position position={p} key={i.toString() + p.title}  />
            ))}
          </div>
        </div>

        {data && modalRef.current && <Modal companyName={companyName} data={data} modalRef={modalRef} open={open} setOpen={setOpen} />}
      </div>
    </>
  );
}

const Position = ({ position }: { position: PositionType;  }) => {
  const { lang } = useContext(GlobalContext);
  const { title, dates, location } = position;
  const { startDate, endDate } = formatDates(dates, lang);
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  return (
    <>
      <div
        ref={ref}
        className="transition-all ease-in-out duration-500 flex lg:flex-row  flex-col lg:items-center justify-between
    cursor-pointer w-full"
      >
        <div className="">
          <div className="flex items-center">
            <div className="h-[2px] w-[8px] bg-gradient-to-l -ml-[7px] from-black/20 to-black/70 dark:from-white/20 dark:to-white/70 fade-in" />
            <div
              className={`text-2lg pt-3 pl-3 group-hover:opacity-50 transition-all duration-300  ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              }`}
            >
              <p className="text-lg ">{title?.[lang]}</p>
              <p className="text-sm font-light mb-1">
                {startDate} • {endDate}
              </p>
              {location && (
                <div className="flex justify-start items-end mb-1">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-xs">{location?.[lang]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Modal = ({
  companyName,
  data,
  modalRef,
  open,
  setOpen,
}: {
  companyName?: string;
  data: Experience;
  modalRef: RefObject<HTMLDialogElement | null>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { lang } = useContext(GlobalContext);
  const { title, description, dates, positions, link, tags } = data;

  const { startDate, endDate } = formatDates(
    [min(positions?.map((p) => p.dates[0])) || dates?.[0], max(positions?.map((p) => p.dates[1])) || dates?.[1]],
    lang
  );
  const outsideClickRef = useOutsideClick<HTMLDivElement>(() => {
    if (open) {
      modalRef.current?.close?.();
      setOpen(false);
    }
  });
  return (
    <dialog
      key={title?.[lang]}
      ref={modalRef as RefObject<HTMLDialogElement>}
      className={`${
        open ? "opacity-100 backdrop-opacity-100" : "opacity-0 backdrop-opacity-0"
      } duration-500 relative backdrop-blur max-w-screen bg-white/30 dark:bg-slate-950/30 transition-all p-4 rounded-xl very-rounded backdrop:backdrop-blur`}
    >
      <div className="max-w-[800px]" ref={outsideClickRef}>
        <div className="group-hover:opacity-50 transition-all duration-300 pr-11">
          <p className="text-2xl font-bold">
            {companyName}
            <span className="text-sm font-thin italic ml-2">
              {" "}
              {startDate}・{endDate}
            </span>
          </p>
          <p className="text-lg ">{title?.[lang]}</p>
          <div className="flex gap-2 flex-wrap mt-3">
            {tags?.map((t) => (
              <span key={t} className="rounded bg-white/60 dark:bg-slate-950/40 px-1 text-sm">
                {t}
              </span>
            ))}
          </div>
          <p className="text-2lg py-3 ">{description?.[lang]}</p>
          {link && (
            <Link href={link} className="text-2lg py-3 italic outline-none hover:opacity-70 transition-all" target="_blank" rel="noopener noreferrer">
              {link}
            </Link>
          )}
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
