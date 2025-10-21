"use client";
import { t } from "@/locales/locale";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import { useGlobal } from "@/context/GlobalContext";
import ModalFormBlock from "./ModalFormBlock";
import { useModal } from "@/context/ModalContext";
import Header from "./Header";
import TrackerSettingsBlock from "./TrackerSettingsBlock";

const MainBlock = () => {
  const { locale, selectedType } = useGlobal();
  const { isModal } = useModal();

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-1/2">
      <Header />
      <div className="w-full font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-2 md:p-6 mb-7">
        {isModal && <ModalFormBlock />}
        <TrackerSettingsBlock />
        <div className="flex justify-between items-center w-full border-b-6 border-blue-400 py-2">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-blue-950 my-auto">
            {t(locale, `body.form.title`)} - {selectedType.title}
          </h2>
        </div>
        <AccordionBlock />
      </div>
    </div>
  );
};

export default MainBlock;
