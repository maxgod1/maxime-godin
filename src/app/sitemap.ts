import flattenDeep from "lodash/flatMapDeep";
import { availableCountries } from "../database/countries";

export default async function Sitemap() {
  const baseUrl = "https://www.maxime-godin.com";
  const map = flattenDeep(
    availableCountries.map((c) => {
      const staticMap = ["", "/projects", "/stack"].map((path) => ({
        url: `${baseUrl}/${c.langCode}${path}`,
        lastModified: new Date(),
        changeFrequency: "Daily",
      }));

      return [staticMap];
    })
  );

  return map;
}
