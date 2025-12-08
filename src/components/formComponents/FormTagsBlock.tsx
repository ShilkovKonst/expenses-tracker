/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { MonthRecord } from "@/lib/types/dataTypes";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { t } from "@/locales/locale";
import { compare } from "@/lib/utils/compareHelper";
import { useTracker } from "@/context/TrackerContext";
import { TextRoundedButton } from "../buttonComponents";
import FormNewTagBlock from "./FormNewTagBlock";

type FormTagsProps = {
  record: MonthRecord;
  setRecord: Dispatch<SetStateAction<MonthRecord>>;
  title: string;
  styleLabel: string;
  styleInput: string;
};

const FormTagsBlock: React.FC<FormTagsProps> = ({
  record,
  setRecord,
  title,
  styleLabel,
}) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();

  const [recordTags, setRecordTags] = useState<number[]>(record?.tags);

  useEffect(() => {
    setRecord({ ...record, tags: recordTags });
  }, [recordTags]);

  const handleAddClick = useCallback(
    (id: number) => {
      if (recordTags.every((t) => t !== id)) {
        setRecordTags([...recordTags, id]);
      }
    },
    [recordTags, setRecordTags]
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      setRecordTags([...recordTags.filter((t) => t !== id)]);
    },
    [recordTags, setRecordTags]
  );

  const tagsEntries = useMemo(() => {
    if (!trackerTags) return [];
    const tEntries = Object.entries(trackerTags).sort((a, b) =>
      compare(a[1], b[1])
    );
    return tEntries.filter((e) => recordTags.every((t) => t !== Number(e[0])));
  }, [trackerTags, recordTags]);

  return (
    <div className="col-span-2">
      <p className={`block font-semibold uppercase text-sm ${styleLabel}`}>
        {title} ({recordTags?.length})
      </p>
      <div
        className={`px-2 min-h-8 w-full border-2 border-blue-100 rounded-md rounded-b-none transition-colors duration-200 ease-in-out bg-white flex flex-wrap py-2 items-center gap-2`}
      >
        {recordTags.length > 0 ? (
          recordTags.map((id, i) => (
            <TextRoundedButton
              key={i}
              id={id}
              title={t(locale, "body.buttons.popups.removeRecordTag")}
              value={trackerTags ? trackerTags[id] : "!error!"}
              handleClick={handleRemoveClick}
              customStyle="bg-blue-300"
            />
          ))
        ) : (
          <p
            className={`block font-medium text-sm text-gray-500 ${styleLabel}`}
          >
            {t(locale, `body.form.placeholders.recordTags`)}
          </p>
        )}
      </div>
      <div className="p-2 border-t-0 border-2 border-blue-100 rounded-md rounded-t-none">
        <div className="relative w-full overflow-hidden pb-2 transition-[height] duration-200 ease-in-out flex flex-wrap items-center gap-2">
          {tagsEntries.map((entry, i) => (
            <TextRoundedButton
              title={t(locale, "body.buttons.popups.addRecordTag")}
              key={i}
              id={Number(entry[0])}
              value={entry[1]}
              handleClick={handleAddClick}
              customStyle="bg-blue-300 hover:bg-blue-400"
            />
          ))}
        </div>
        {(!tagsEntries || tagsEntries.length === 0) && (
          <p className={`font-medium text-xs`}>
            {t(locale, `body.form.placeholders.tagsListEmpty`)}
          </p>
        )}
        <FormNewTagBlock
          recordTags={recordTags}
          setRecordTags={setRecordTags}
        />
      </div>
    </div>
  );
};

export default FormTagsBlock;
