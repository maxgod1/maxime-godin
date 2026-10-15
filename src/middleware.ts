import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { NextResponse, type NextRequest } from "next/server";
import { availableCountries, defaultLocale } from "./database/countries";

const headers = { "accept-language": "en-GB,en;q=0.5" };
const languages = new Negotiator({ headers }).languages();
const locales = availableCountries.map((c) => c.langCode);
const localeLike = /^[a-z]{2,3}(?:-[a-zA-Z]{2,4})?$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/favicon.ico") {
    return new NextResponse(null, { status: 404 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.nextUrl.pathname);

  const hasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
  const isInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/sitemap");

  if (hasLocale || isInternal) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const locale = match(languages, locales, defaultLocale);
  const [first, ...rest] = pathname.split("/").filter(Boolean);
  const unsupportedLocale = first && localeLike.test(first) && !locales.includes(first as (typeof locales)[number]);

  req.nextUrl.pathname = unsupportedLocale
    ? `/${locale}${rest.length ? `/${rest.join("/")}` : ""}`
    : `/${locale}${pathname}`;

  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files. favicon.ico is included so an unknown
    // [lang] segment does not try to render it.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
