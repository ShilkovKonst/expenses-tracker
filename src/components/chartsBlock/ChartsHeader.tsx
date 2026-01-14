import { useTracker } from "@/context/TrackerContext";
import { compare } from "@/lib/utils/compareHelper";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

type ChartsHeaderProps = {
  setSelectedTag: Dispatch<SetStateAction<number>>;
};

const ChartsHeader = ({ setSelectedTag }: ChartsHeaderProps) => {
  const { trackerTags } = useTracker();

  const tagsArray = useMemo(
    () => (trackerTags ? Object.entries(trackerTags) : []),
    [trackerTags]
  );

  const handleSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setSelectedTag(Number(e.target.value));
    },
    [setSelectedTag]
  );

  return (
    <div className="w-full flex justify-between items-center  border-2 bg-blue-200 border-blue-300">
      <p>Выберите тэг для обзора</p>
      <select onChange={(e) => handleSelect(e)}>
        <option value={-1}>Общий обзор</option>
        {tagsArray.sort((a, b) => compare(a[1], b[1])).map((tag, i) => (
          <option key={i} value={tag[0]}>
            {tag[1]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartsHeader;
