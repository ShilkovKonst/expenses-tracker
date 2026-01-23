"use client";
import DescPBlock from "@/components/descriptionComponents/DescPBlock";
import { useGlobal } from "@/context/GlobalContext";
import { useTracker } from "@/context/TrackerContext";
import { MonthRecord } from "@/lib/types/dataTypes";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { t } from "@/locales/locale";
import { useMemo } from "react";

type RecordDescriptionBlockProps = {
  outerStyle: string;
  record: MonthRecord;
};

const RecordDescriptionBlock: React.FC<RecordDescriptionBlockProps> = ({
  outerStyle,
  record,
}) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();

  const recordTags = useMemo(() => {
    if (!record.tags?.length) return [];
    return trackerTags ? record.tags.map((t) => trackerTags[t]) : [];
  }, [record.tags, trackerTags]);

  return (
    <div className={outerStyle}>
      <div className="col-span-2 md:row-span-2 md:col-span-1 lg:col-span-2 grid gap-2">
        <DescPBlock
          outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
          valueStyle={`font-semibold text-xs truncate`}
          title={`${t(locale, `body.form.labels.date`)}: `}
          value={`${
            record.day > -1
              ? record.day
              : t(locale, "body.form.labels.withoutDate")
          }`}
        />
        <DescPBlock
          outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
          valueStyle={`font-semibold ${
            record.type === "income" ? "text-green-600" : "text-red-500"
          } text-xs truncate`}
          title={`${t(locale, `body.form.operations.amount`)}: `}
          value={decimalToInputString(locale, record.amount)}
        />
      </div>
      <DescPBlock
        outerStyle="col-span-2 md:col-span-3 flex flex-row gap-2 justify-start items-start"
        valueStyle="font-semibold text-xs"
        title={`${t(locale, `body.form.operations.labelTags`)}: `}
        value={
          recordTags.length > 0
            ? recordTags
            : t(locale, "body.form.labels.withoutTags")
        }
      />
      <DescPBlock
        outerStyle="col-span-4 md:col-span-3 flex flex-row gap-2 justify-start items-center"
        valueStyle="font-semibold text-xs"
        title={`${t(locale, `body.form.operations.description`)}: `}
        value={
          record.description.length > 0
            ? record.description
            : t(locale, "body.form.labels.withoutDesc")
        }
      />
    </div>
  );
};

export default RecordDescriptionBlock;
