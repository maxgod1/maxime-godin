"use client";

import { LanguageStrings } from "../../types/countries";
import { createContext } from "react";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
// import { useEffect } from "react";
// import { env } from "../../../env.mjs";

type Props = {
  children: React.ReactNode;
  params: { lang: LanguageStrings };
  theme: "dark" | "light";
  previousUrl: string;
  strings: Record<string, string>;
};
export const GlobalContext = createContext<{
  lang: LanguageStrings;
  theme: "dark" | "light";
  previousUrl: string;
  strings: Record<string, string>;
  duration: number;
}>({
  lang: "en-US",
  theme: "light",
  previousUrl: "",
  strings: {},
  duration: 0.5,
});

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
//     capture_pageview: false, // Disable automatic pageview capture, as we capture manually
//   });
// }

// export function PostHogPageview(): JSX.Element {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     if (pathname) {
//       let url = window.origin + pathname;
//       if (searchParams && searchParams.toString()) {
//         url = url + `?${searchParams.toString()}`;
//       }
//       posthog.capture("$pageview", {
//         $current_url: url,
//       });
//     }
//   }, [pathname, searchParams]);

//   return <></>;
// }

// export function PHProvider({ children }: { children: React.ReactNode }) {
//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// }

export const ContextProvider = ({ children, params, theme, previousUrl, strings }: Props) => {
  return (
    <GlobalContext.Provider
      value={{
        duration: 0.3,
        lang: params.lang,
        theme,
        previousUrl,
        strings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
