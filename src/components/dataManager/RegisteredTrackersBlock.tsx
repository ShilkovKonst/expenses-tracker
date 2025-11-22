"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import TagButton from "../buttonComponents/TagButton";
import { useTracker } from "@/context/TrackerContext";
import { Year } from "@/lib/types/dataTypes";
import { getMetadata } from "@/idb/metaCRUD";
import { getAllTags } from "@/idb/tagsCRUD";
import { getAllRecords } from "@/idb/recordsCRUD";
import { populateYears } from "@/lib/utils/yearsTransformer";

const RegisteredTrackersBlock = () => {
  const { locale, trackerIds } = useGlobal();
  const {
    trackerId,
    setTrackerId,
    setTrackerYears,
    setTrackerMeta,
    setTrackerTags,
  } = useTracker();

  const handleClick = async (id: string) => {
    const meta = await getMetadata(id);
    const tags = await getAllTags(id);
    const allRecords = await getAllRecords(id);

    const years: Record<number, Year> = populateYears(allRecords);
    if (meta && tags && years) {
      setTrackerId(id);
      setTrackerMeta(meta);
      setTrackerTags(tags);
      setTrackerYears(years);
    }
  };

  return (
    <div className="col-span-3 flex justify-between items-start gap-2 border-b-6 border-blue-400 pt-2">
      <div className="flex flex-col gap-2">
        <h3 className={`block font-semibold uppercase text-sm`}>
          {t(locale, `body.form.tracker.idsTitle`)}
        </h3>
        <div className="relative w-full overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2">
          {trackerIds.map((id, i) => (
            <TagButton
              key={i}
              tag={id}
              handleClick={() => handleClick(id)}
              style="bg-blue-300 hover:bg-blue-400 transition-colors duration-200 ease-in-out disabled:bg-green-500 disabled:hover:bg-green-500"
              disabled={trackerId === id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisteredTrackersBlock;
