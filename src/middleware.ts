import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { NextResponse, type NextRequest } from "next/server";
import { availableCountries } from "./database/countries";

// -> 'en-US'

let headers = { "accept-language": "en-GB,en;q=0.5" };
let languages = new Negotiator({ headers }).languages();
let locales = availableCountries.map((c) => c.langCode);
let defaultLocale = "en-GB";
// Get the preferred locale, similar to the above or using a library

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.nextUrl.pathname);

  const noNeedToAddLocale =
    locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/images") ||
    req.nextUrl.pathname.startsWith("/logo") ||
    req.nextUrl.pathname.startsWith("/sitemap");

  if (noNeedToAddLocale) {
    const res = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    });
    return res;
  }

  // Redirect if there is no locale
  const locale = match(languages, locales, defaultLocale);
  req.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en-US/products

  return Response.redirect(req.nextUrl);
}

export const config = {
  matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
  ],
}
