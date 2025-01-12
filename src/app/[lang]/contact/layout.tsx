import { LanguageStrings } from "../../../types/countries";
import { getDictionary } from "../../../utils/dictionaries/_dictionaries";

export async function generateMetadata(props: { params: Promise<{ lang: LanguageStrings }> }) {
  const params = await props.params;
  const { title_contact: title, description_contact: description } = await getDictionary("metadata", params.lang);
  return {
    title,
    description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
