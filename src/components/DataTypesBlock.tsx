"use client";
import { TrackerType } from "@/types/formTypes";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import TagButton from "./buttonComponents/TagButton";
import TopLevelButton from "./buttonComponents/TopLevelButton";
import { SettingsIcon } from "@/lib/icons";
import { useModal } from "@/context/ModalContext";

type DataTypesProps = {
  trackerTypes: TrackerType[];
  handleSelectType: (type: TrackerType) => void;
};

const DataTypesBlock: React.FC<DataTypesProps> = ({
  trackerTypes,
  handleSelectType,
}) => {
  const { locale, selectedType } = useGlobal();
  const { setIsSettingsModal, setIsModal } = useModal();

  const handleClick = () => {
    setIsModal(true);
    setIsSettingsModal(true);
  };

  return (
    <div className=" border-t-0 border-l-0 border-2 border-blue-100 flex justify-between items-start gap-2">
      <div className="flex flex-col gap-2">
        <h3 className={`block font-semibold uppercase text-sm`}>
          {t(locale, `body.form.tracker.typeTitle`)}
        </h3>
        <div className="relative w-full overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2">
          {trackerTypes.map((type, i) => (
            <TagButton
              key={i}
              tag={type.title}
              handleClick={() => handleSelectType(type)}
              style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out disabled:bg-green-500 disabled:hover:bg-green-500"
              disabled={selectedType && selectedType.title === type.title}
            />
          ))}
        </div>
      </div>
      <TopLevelButton
        icon={<SettingsIcon style="h-7 w-7" />}
        style="bg-blue-400 hover:bg-blue-500 col-span-2 md:col-span-1 h-9 w-9 mr-2"
        title=""
        handleClick={handleClick}
      />
    </div>
  );
};

export default DataTypesBlock;
