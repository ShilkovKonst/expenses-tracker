import { useTracker } from "@/context/TrackerContext";
import { createTagId, TagId } from "@/lib/types/brand";
import { compare } from "@/lib/utils/compareHelper";
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
    <div className="w-full flex justify-between items-center h-7 border-2 bg-blue-200 border-blue-300 px-1">
      <p>Выберите тэг для обзора</p>
      <select
        className="border-2 border-blue-300 focus:outline-0 focus:border-blue-300 rounded-md text-sm bg-blue-50/95"
        onChange={(e) => handleSelect(e)}
      >
        <option value={-1}>Общий обзор</option>
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
