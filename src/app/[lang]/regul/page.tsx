import type { Metadata } from "next";
import RegulSheet from "../../components/regul/RegulSheet";
import { isRegulUnlocked } from "../../../actions/regulAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Moyennes",
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

export default async function RegulPage() {
  const unlocked = await isRegulUnlocked();
  return <RegulSheet initialUnlocked={unlocked} />;
}
