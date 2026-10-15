import { availableCountries, defaultLocale, isLanguage } from "../../database/countries";
import { LanguageStrings } from "../../types/countries";
import HeaderNav from "../components/HeaderNav";
import { redirect } from "next/navigation";
import "./globals.css";
import { ContextProvider, PostHogPageview } from "../providers/GlobalProvider";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import { Red_Hat_Display } from "next/font/google";
import { getTheme } from "../../actions/cookieActions";

import { headers } from "next/headers";
import BackgroundColorWrapper from "../components/BackgroundColorWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import images from "../../database/image-data";
import { getStaticImgUrl } from "../../utils/utils";

const sans = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export async function generateStaticParams() {
  return availableCountries.map((c) => ({ lang: c.langCode }));
}

function supportedLang(lang: string): LanguageStrings {
  if (!isLanguage(lang)) redirect(`/${defaultLocale}`);
  return lang;
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = supportedLang(params.lang);
  const { title, description } = await getDictionary("metadata", lang);
  return {
    title,
    description,
    metadataBase: new URL("https://maxime-godin.com"),

    alternates: {
      canonical: "/",
      languages: availableCountries.map((c) => c.langCode).reduce((code, key) => Object.assign(code, { [key]: key }), {}),
    },

    openGraph: {
      title: "Maxime Godin",
      description: description,
      url: "https://maxime-godin.com",
      siteName: "Maxime Godin",
      images: [
        {
          url: getStaticImgUrl(images["og-image"].fileKey),
          width: 667,
          height: 667,
        },
      ],
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout(
  props: { children: React.ReactNode; params: Promise<{ lang: string }> }
) {
  const params = await props.params;
  const lang = supportedLang(params.lang);

  const {
    children
  } = props;

  const [theme, strings] = await Promise.all([getTheme(), getDictionary("home", lang)]);
  const headersList = await headers();
  const referer = headersList.get("referer");

  return (
    <html lang={lang} className={`${sans.className} ${theme || "dark"} scroll-smooth`} style={{ colorScheme: theme || "dark" }}>
      <SpeedInsights />
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <ContextProvider lang={lang} theme={theme} previousUrl={referer || ""} strings={strings}>
        <body className="">
          <HeaderNav />
          <main className="scroll-smooth w-screen h-[100dvh] overflow-scroll transition-all lg:bg-gradient-to-b bg-gradient-to-t lg:to-80% to-80% from-gray-300 to-white dark:from-slate-950 dark:to-slate-700">
            <BackgroundColorWrapper>{children}</BackgroundColorWrapper>
          </main>
        </body>
        {/* <CookieBanner strings={strings} /> */}
      </ContextProvider>
    </html>
  );
}
