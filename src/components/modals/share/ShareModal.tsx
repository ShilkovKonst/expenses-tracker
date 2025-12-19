"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import ModalBase from "../ModalBase";
import { ModalMap } from "../ModalRoot";

const ShareModal = ({
  onClose,
}: ModalMap["share"] & { onClose: () => void }) => {
  const { locale } = useGlobal();

  return (
    <ModalBase
      title={t(locale, "body.personnalisation.title")}
      desc={t(locale, "body.personnalisation.descriptionTitle")}
      sectionGridCols={2}
      closeButtonTitle={t(locale, "body.buttons.close")}
      cancelButtonTitle={t(locale, "body.buttons.close")}
      onClose={onClose}
    >
      <>test</>
    </ModalBase>
  );
};

export default ShareModal;

const shareLinks = {
  telegram: (text: string, url: string) => 
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  
  whatsapp: (text: string, url: string) => 
    `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  
  twitter: (text: string, url: string) => 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  
  facebook: (url: string) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  
  linkedin: (url: string, title: string) => 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  
  reddit: (url: string, title: string) => 
    `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
};