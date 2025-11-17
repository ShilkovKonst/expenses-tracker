/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { useEffect } from "react";
import TagButton from "../buttonComponents/TagButton";
import { useTracker } from "@/context/TrackerContext";
import { GlobalDataType } from "@/types/formTypes";

const RegisteredTrackersBlock = () => {
  const { locale, trackerIds, setTrackerIds } = useGlobal();
  const {
    trackerId,
    setTrackerId,
    setTrackerYears,
    setTrackerMeta,
    setTrackerTags,
  } = useTracker();

  useEffect(() => {
    if (localStorage && trackerIds) {
      for (const id of trackerIds) {
        const tracker = localStorage.getItem(id);
        if (!tracker) {
          setTrackerIds([...trackerIds.filter((t) => t !== id)]);
          break;
        }
      }
    }
  }, [trackerIds]);

  const handleClick = (id: string) => {
    if (localStorage) {
      const raw = localStorage.getItem(id);
      if (!raw) throw new Error("Such tracker should be already registered!");

      const parsedTracker: GlobalDataType = JSON.parse(raw);
      if (parsedTracker.id) setTrackerId(parsedTracker.id);
      if (parsedTracker.meta) setTrackerMeta(parsedTracker.meta);
      if (parsedTracker.tagsPool) setTrackerTags(parsedTracker.tagsPool);
      if (parsedTracker.years) setTrackerYears(parsedTracker.years);
    }
  };

  return (
    <div className="col-span-3 flex justify-between items-start gap-2 border-t-6 border-blue-400 pt-2">
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
