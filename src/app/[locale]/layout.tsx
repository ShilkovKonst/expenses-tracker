import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Locale, t } from "@/locales/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/constants";
import NavBlock from "@/components/NavBlock";
import { AppProviders } from "@/context/AppProviders";
import PwaInit from "@/components/PwaInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeMap: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    ru: "ru_RU",
  };

  return {
    title: {
      default: t(locale as Locale, "meta.titleFull"),
      template: `%s | ${t(locale as Locale, "meta.titleFull")}`,
    },
    description: t(locale as Locale, "meta.description"),
    verification: {
      google: "vupSTkuQmh-5xpQ1UoVfkq73QvvjpXf5GXxn5J83WgU",
    },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}/`,
      languages: {
        en: `${BASE_URL}/en/`,
        fr: `${BASE_URL}/fr/`,
        ru: `${BASE_URL}/ru/`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: t(locale as Locale, "meta.titleFull"),
      description: t(locale as Locale, "meta.description"),
      url: `${BASE_URL}/${locale}/`,
      siteName: t(locale as Locale, "meta.titleFull"),
      locale: localeMap[locale],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t(locale as Locale, "meta.titleFull"),
      description: t(locale as Locale, "meta.description"),
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "SpendObserver",
    },
    icons: {
      apple: "/icons/icon-192.png",
    },
  };
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-full antialiased relative`}
      >
        <AppProviders>
          <PwaInit />
          <Header />
          <NavBlock />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
