"use client";

import React, { useContext, useEffect, useState } from "react";
import Flags from "country-flag-icons/react/3x2";
import { LanguageStrings } from "../../../types/countries";
import { useOutsideClick } from "../../../hooks/ClickOutside";
import { GlobalContext } from "../providers";
import { usePathname, useRouter } from "next/navigation";
import { availableCountries } from "../../../utils/constants/countries";
import { setLanguageCookie } from "../../../actions/languageActions";

const LanguageSelect = () => {
  const router = useRouter();

  const { lang } = useContext(GlobalContext);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  const SelectedFlag = Flags[availableCountries.find((l) => l.langCode === lang)?.countryCode || "GB"];
  const selectLanguage = async (langCode: LanguageStrings) => {
    setOpen(false);
    router.push(`/${langCode}/${pathname.split(`/${lang}`)[1]}`);
  };

  useEffect(() => {
    setLanguageCookie(lang);
  }, [lang]);

  return (
    <div className="fade-in relative flex items-center justify-center lg:gap-3 gap-5" ref={ref}>
      {availableCountries
        .filter((l) => l.langCode !== lang)
        .map((l) => {
          const Flag = Flags[l.countryCode];
          const isSelected = l.langCode === lang;

          return (
            <button
              key={l.langCode}
              className={`flex items-center rounded-full overflow-hidden ${isSelected ? "cursor-default" : "cursor-pointer hover:opacity-60"} `}
              onClick={() => (!isSelected ? selectLanguage(l.langCode) : null)}
            >
              <Flag className="h-5" />
            </button>
          );
        })}
    </div>
  );
};

export default LanguageSelect;
