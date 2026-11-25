import type { Metadata, Viewport } from "next";
import RegulSheet from "../../components/regul/RegulSheet";
import { isRegulUnlocked } from "../../../actions/regulAuth";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  return {
    title: "Moyennes",
    manifest: `/${lang}/regul/manifest.webmanifest`,
    appleWebApp: {
      capable: true,
      title: "Moyennes",
      statusBarStyle: "default",
    },
    icons: {
      apple: [{ url: "/regul/apple-touch-icon.png", sizes: "180x180" }],
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function RegulPage() {
  const unlocked = await isRegulUnlocked();
  return <RegulSheet initialUnlocked={unlocked} />;
}
