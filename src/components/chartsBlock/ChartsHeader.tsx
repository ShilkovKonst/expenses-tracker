import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { createTagId, TagId } from "@/lib/types/brand";
import { compare } from "@/lib/utils/compareHelper";
import { t } from "@/locales/locale";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

type ChartsHeaderProps = {
  setSelectedTag: Dispatch<SetStateAction<TagId>>;
};

const ChartsHeader = ({ setSelectedTag }: ChartsHeaderProps) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();

  const tagsArray = useMemo(
    () => (trackerTags ? Object.entries(trackerTags) : []),
    [trackerTags],
  );

  const handleSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setSelectedTag(createTagId(Number(e.target.value)));
    },
    [setSelectedTag],
  );

  return (
    <div className="w-full flex justify-between items-center h-10 border-2 bg-blue-200 border-blue-300 px-1">
      <p className="text-base font-semibold text-blue-800">
        {t(locale, "body.charts.title")}
      </p>
      <select
        className="cursor-pointer h-7.5 border-2 border-blue-300 focus:outline-0 focus:border-blue-300 rounded-md text-sm bg-blue-50/95"
        onChange={(e) => handleSelect(e)}
      >
        <option value={-1}>{t(locale, "body.charts.allTags")}</option>
        {tagsArray
          .sort((a, b) => compare(a[1], b[1]))
          .map((tag, i) => (
            <option key={i} value={tag[0]}>
              {tag[1]}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ChartsHeader;
