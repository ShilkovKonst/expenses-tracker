"use client";
import { t } from "@/locales/locale";
import AccordionBlock from "./accordionBlockComponents/AccordionBlock";
// import ModalBlock from "./ModalFormBlock";
import DataTypesBlock from "./DataTypesBlock";
import { useGlobal } from "@/app/context/GlobalContext";

const MainBlock = () => {
  const { locale } = useGlobal();

  // const [isModal, setIsModal] = useState<boolean>(false);
  // const [modal, setModal] = useState<ModalType | null>(null);

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
      <header className="w-full bg-blue-950 text-white p-2 md:p-8 text-center rounded-t-xl">
        <h1 className="m-0 text-4xl font-bold">
          {t(locale, "body.header.title")}
        </h1>
      </header>
      <div className="w-full font-sans pb-7 border-2 border-blue-100 rounded-b-lg bg-blue-50 p-2 md:p-6 mb-7">
        {/* {isModal && (
        <ModalBlock
          title={t(locale, "body.form.costsTagFormTitle")}
          inputPlaceholder={t(locale, `body.form.costsTagCustomTitle`)}
          confirmText="&#10004;"
          cancelText="&#10006;"
          checkBoxTip={t(locale, `body.modal.checkBoxTip`)}
          setIsModal={setIsModal}
          confirmClick={() => {}}
        />
      )} */}
        <div className="flex justify-between items-center w-full border-b-6 border-blue-400 pb-2">
          <h2 className="text-4xl font-semibold text-blue-950 my-auto">
            {t(locale, `body.form.title`)}
          </h2>
        </div>
        <DataTypesBlock />
        <AccordionBlock />
      </div>
    </div>
  );
};

export default MainBlock;
