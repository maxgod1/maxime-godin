import { defaultLocale, isLanguage } from "../../../../database/countries";

export async function GET(_request: Request, context: { params: Promise<{ lang: string }> }) {
  void _request;
  const { lang: urlLang } = await context.params;
  const lang = isLanguage(urlLang) ? urlLang : defaultLocale;

  const manifest = {
    name: "Moyennes",
    short_name: "Moyennes",
    start_url: `/${lang}/regul`,
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/regul/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/regul/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/regul/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/regul/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
