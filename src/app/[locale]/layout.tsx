import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Locale, t } from "@/locales/locale";
import { GlobalProvider } from "../../context/GlobalContext";
import { ModalProvider } from "../../context/ModalContext";
import { BASE_URL } from "@/lib/constants";
import { TrackerProvider } from "@/context/TrackerContext";

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
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/`,
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
      url: BASE_URL,
      siteName: t(locale as Locale, "meta.titleFull"),
      locale: localeMap[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t(locale as Locale, "meta.titleFull"),
      description: t(locale as Locale, "meta.description"),
      creator: "@yourhandle",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white relative flex justify-center w-full`}
      >
        <GlobalProvider>
          <TrackerProvider>
            <ModalProvider>
              {children}
              <footer className=""></footer>
            </ModalProvider>
          </TrackerProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
