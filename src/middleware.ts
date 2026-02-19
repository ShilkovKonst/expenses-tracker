import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import { Locale } from "./locales/locale";
import Negotiator from "negotiator";

  const locales = ["en", "ru", "fr"];
  const defaultLocale = "en";
  
  function getLocale(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, locales, defaultLocale) as Locale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return;
  }

  const locale = getLocale(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"], // пропускаем служебные пути, API и статические файлы
};
