import { LanguageStrings } from "../../../types/countries";
import { getDictionary } from "../../../utils/dictionaries/_dictionaries";

export async function generateMetadata({ params }: { params: { lang: LanguageStrings } }) {
  const { title_projects: title, description_projects: description } = await getDictionary("metadata", params.lang);
  return {
    title,
    description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
