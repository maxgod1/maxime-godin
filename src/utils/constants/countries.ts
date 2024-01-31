import { CountryCodeStrings, CurrencyCodesStrings, LanguageStrings } from "../../types/countries";

export const availableCountries: {
  countryCode: CountryCodeStrings;
  langCode: LanguageStrings;
  langName: string;
  emoji: string;
  currencyCode: CurrencyCodesStrings;
}[] = [
    { countryCode: "GB", langCode: "en-GB", langName: "English", currencyCode: "GBP", emoji: "🇺🇸" },
    { countryCode: "FR", langCode: "fr", langName: "French", currencyCode: "EUR", emoji: "🇫🇷" },
    { countryCode: "JP", langCode: "ja", langName: "日本語", currencyCode: "JPY", emoji: "🇯🇵" },
  ];
