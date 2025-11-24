"use client";
import { t } from "@/locales/locale";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
import ModalBlock from "./modals/ModalBlock";
import { useGlobal } from "@/context/GlobalContext";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import StickyBlock from "./stickyComponents/StickyBlock";
import RegisteredTrackersBlock from "./trackerDataComponents/RegisteredTrackersBlock";

const MainBlock = () => {
  const { locale, trackerIds } = useGlobal();
  const { trackerId } = useTracker();
  const { isModal } = useModal();

  return (
    <>
      <StickyBlock />
      {isModal && <ModalBlock />}
      {trackerIds.length > 0 && <RegisteredTrackersBlock />}
      {trackerId && (
        <div className="flex flex-col justify-between items-center w-full py-2">
          <h2 className="w-full text-xl md:text-3xl lg:text-4xl font-semibold text-blue-950 my-auto border-b-6 border-blue-400">
            {t(locale, `body.form.title`)} - {trackerId}
          </h2>
          <AccordionBlock />
        </div>
      )}
    </>
  );
};

export default MainBlock;
