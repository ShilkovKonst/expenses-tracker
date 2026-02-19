"use client";
import { useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import ModalBase from "../ModalBase";
import { t } from "@/locales/locale";
import Image from "next/image";

const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL;
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

type ListPage = Exclude<ModalMap["info"]["page"], "contact">;

const contentKeys: Record<
  ListPage,
  {
    titleKey: string;
    section: string;
    count: number;
    images?: Record<number, string>;
  }
> = {
  about: {
    titleKey: "body.modal.about.title",
    section: "body.modal.about.features",
    count: 9,
    images: {
      6: "/about-calculator.png",
      9: "/about-install.png",
    },
  },
  confidentiality: {
    titleKey: "body.modal.confidentiality.title",
    section: "body.modal.confidentiality.content",
    count: 5,
  },
  conditions: {
    titleKey: "body.modal.conditions.title",
    section: "body.modal.conditions.content",
    count: 4,
  },
};

const InfoModal = ({
  page,
  onClose,
}: ModalMap["info"] & { onClose: () => void }) => {
  const { locale } = useGlobal();

  if (page === "contact") {
    return (
      <ModalBase
        title={t(locale, "body.modal.contact.title")}
        sectionGridCols={2}
        closeButtonTitle={t(locale, "body.buttons.close")}
        cancelButtonTitle={t(locale, "body.buttons.close")}
        onClose={onClose}
      >
        <div className="col-span-2 flex flex-col gap-4 px-2 py-2 text-sm">
          <p className="text-gray-600 italic">
            {t(locale, "body.modal.contact.intro")}
          </p>
          {CONTACT_EMAIL && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {t(locale, "body.modal.contact.email")}
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          )}
          {LINKEDIN_URL && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">LinkedIn</span>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {t(locale, "body.modal.contact.linkedin")}
              </a>
            </div>
          )}
        </div>
      </ModalBase>
    );
  }

  const { titleKey, section, count, images } = contentKeys[page];
  const items = Array.from({ length: count }, (_, i) =>
    t(locale, `${section}.${i + 1}`),
  );

  return (
    <ModalBase
      title={t(locale, titleKey)}
      sectionGridCols={2}
      closeButtonTitle={t(locale, "body.buttons.close")}
      cancelButtonTitle={t(locale, "body.buttons.close")}
      onClose={onClose}
    >
      <ul className="col-span-2 flex flex-col gap-2 px-2 py-1 text-sm">
        {items.map((text, i) => {
          const itemNumber = i + 1;
          const image = images?.[itemNumber];
          return (
            <li key={i} className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="text-blue-500 shrink-0">&#x2022;</span>
                <span>{text}</span>
              </div>
              {image && (
                <Image 
                  src={image}
                  width={350} height={40}
                  alt=""
                  className="ml-4 rounded border border-blue-200 max-w-full"
                />
              )}
            </li>
          );
        })}
      </ul>
    </ModalBase>
  );
};

export default InfoModal;
