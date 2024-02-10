enum Languages {
  "en-GB" = "en-GB",
  "fr" = "fr",
  "ja" = "ja",
}

export type LanguageStrings = keyof typeof Languages;


enum CountryCodes {
  "US" = "US",
  "GB" = "GB",
  "ES" = "ES",
  "FR" = "FR",
  "DE" = "DE",
  "IT" = "IT",
  "JP" = "JP",
}
export type CountryCodeStrings = keyof typeof CountryCodes;

enum CurrencyCodes {
  "USD" = "USD",
  "GBP" = "GBP",
  "EUR" = "EUR",
  "JPY" = "JPY",
}
export type CurrencyCodesStrings = keyof typeof CurrencyCodes;
