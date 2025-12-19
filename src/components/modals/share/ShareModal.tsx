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
