import { availableCountries } from "../../utils/constants/countries";
import { LanguageStrings } from "../../types/countries";
import HeaderNav from "./_components/HeaderNav";
import "./globals.css";
import { ContextProvider } from "./providers";
import { getDictionary } from "../../utils/dictionaries/_dictionaries";
import { Red_Hat_Display } from "next/font/google";
import { getTheme } from "../../actions/cookieActions";

import { headers } from "next/headers";
import BackgroundColorWrapper from "./_components/BackgroundColorWrapper";

const sans = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export async function generateStaticParams() {
  return availableCountries.map((c) => ({ lang: c.langCode }));
}

export async function generateMetadata({ params }: { params: { lang: LanguageStrings } }) {
  const { title, description } = await getDictionary("metadata", params.lang);
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
          url: "/images/og-image.jpg",
          width: 800,
          height: 600,
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

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: LanguageStrings } }) {
  const [theme, strings] = await Promise.all([getTheme(), getDictionary("home", params.lang)]);
  const headersList = headers();
  const referer = headersList.get("referer");

  return (
    <html lang={params.lang} className={`${sans.className} ${theme || "dark"} scroll-smooth`} style={{ colorScheme: theme || "dark" }}>
      {/* <SpeedInsights />
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider> */}
      <ContextProvider params={params} theme={theme} previousUrl={referer || ""} strings={strings}>
        <body className="">
          <HeaderNav />
          <main className="scroll-smooth w-screen h-[100dvh] overflow-scroll transition-all lg:bg-gradient-to-b bg-gradient-to-t lg:to-80% to-80% from-gray-300 to-white dark:from-slate-950 dark:to-slate-700">
            <BackgroundColorWrapper>{children}</BackgroundColorWrapper>
          </main>
        </body>
        {/* <CookieBanner strings={strings} /> */}
      </ContextProvider>
      {/* </PHProvider> */}
    </html>
  );
}
