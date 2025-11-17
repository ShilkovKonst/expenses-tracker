"use client";
import { t } from "@/locales/locale";
import { useState } from "react";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import Header from "./Header";
import TrackerBlock from "./TrackerBlock";
import ModalBlock from "./modals/ModalBlock";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";

const MainBlock = () => {
  const { locale } = useGlobal();
  const { trackerId } = useTracker();
  const { isModal } = useModal();

  const [dirty, setDirty] = useState(false);

  const onSave = () => {
    console.log("Сохраняем текущий трекер...");
    setDirty(false);
  };

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 2xl:w-1/2">
      <Header />
      <div className="w-full font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-2 md:p-6 mb-7">
        <TrackerBlock />
        {isModal && <ModalBlock />}
        {trackerId && (
          <>
            <div className="flex justify-between items-center w-full border-b-6 border-blue-400 py-2">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-blue-950 my-auto">
                {t(locale, `body.form.title`)} - {trackerId}
              </h2>
            </div>
            <AccordionBlock />
          </>
        )}
      </div>
    </div>
  );
};

export default MainBlock;
