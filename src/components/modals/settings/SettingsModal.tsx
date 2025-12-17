"use client";
import { useGlobal } from "@/context/GlobalContext";
import { ModalMap } from "../ModalRoot";
import ModalBase from "../ModalBase";
import { t } from "@/locales/locale";
import SettingsBlock from "./SettingsBlock";

const SettingsModal = ({
  onClose,
}: ModalMap["settings"] & { onClose: () => void }) => {
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
      <SettingsBlock />
    </ModalBase>
  );
};

export default SettingsModal;
