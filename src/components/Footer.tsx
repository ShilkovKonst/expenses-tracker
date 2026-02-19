"use client";

import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { t } from "@/locales/locale";

const Footer = () => {
  const { locale } = useGlobal();
  const { openModal } = useModal();

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
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => openModal("info", { page: "about" })}
            >
              {t(locale, "body.footer.about")}
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => openModal("info", { page: "confidentiality" })}
            >
              {t(locale, "body.footer.confidentiality")}
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => openModal("info", { page: "conditions" })}
            >
              {t(locale, "body.footer.conditions")}
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              onClick={() => openModal("info", { page: "contact" })}
            >
              {t(locale, "body.footer.contact")}
            </button>
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
