"use client";

import { setThemeCookie } from "../../actions/cookieActions";
import { LanguageStrings } from "../../types/countries";
import { createContext, useEffect, useState, type JSX } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "../../../env.mjs";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: { lang: LanguageStrings };
  theme: "dark" | "light" | undefined;
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
  lang: "en-GB",
  theme: "light",
  previousUrl: "",
  strings: {},
  duration: 0.5,
});

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && env.NEXT_PUBLIC_ENVIRONMENT !== "development") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export const ContextProvider = ({ children, params, theme, previousUrl, strings }: Props) => {
  const [initTheme, setInitTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setInitTheme("dark");
      if (!theme) setThemeCookie("dark");
    } else {
      setInitTheme("light");
      if (!theme) setThemeCookie("light");
    }
  }, [theme]);

  return (
    <PHProvider>
      <GlobalContext.Provider
        value={{
          duration: 0.3,
          lang: params.lang,
          theme: theme || initTheme,
          previousUrl,
          strings,
        }}
      >
        {children}
      </GlobalContext.Provider>
    </PHProvider>
  );
};
