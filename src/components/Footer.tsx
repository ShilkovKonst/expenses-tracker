"use client";

import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

const Footer = () => {
  const { locale } = useGlobal();
  return (
    <>
      <footer className="w-full bg-blue-950 text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold mb-1">
              {t(locale, "body.footer.title")}
            </p>
            <p className="text-xs text-blue-300">
              {t(locale, "body.footer.copyright")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-blue-200">
            <a href="#" className="hover:text-white transition-colors">
              {t(locale, "body.footer.about")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t(locale, "body.footer.confidentiality")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t(locale, "body.footer.conditions")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t(locale, "body.footer.contact")}
            </a>
          </div>
          <p className="text-xs text-blue-300 text-center md:text-right">
            {t(locale, "body.footer.author")}
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
