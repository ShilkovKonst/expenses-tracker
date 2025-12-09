"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { MONTHS } from "@/constants";
import { useTracker } from "@/context/TrackerContext";
import DescPBlock from "../../descriptionComponents/DescPBlock";
import { MonthRecord } from "@/lib/types/dataTypes";
import { decimalToInputString } from "@/lib/utils/amountHelper";

type ModalDeleteProps = {
  entity: MonthRecord;
};

const RecordDeleteBlock = ({ entity }: ModalDeleteProps) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();

  return (
    <div className="col-span-2 flex flex-col gap-2 justify-center items-start mb-3">
      <div className="w-full grid grid-cols-2 gap-2">
        <DescPBlock
          outerStyle="flex flex-row gap-2 justify-start items-start"
          valueStyle={`font-semibold text-xs truncate`}
          title={`${t(locale, `body.form.labels.year`)}: `}
          value={`${entity.year}, ${t(
            locale,
            `body.form.valueMonth.${MONTHS[entity.month]}`
          )}`}
        />
        <DescPBlock
          outerStyle="flex flex-row gap-2 justify-start items-start"
          valueStyle={`font-semibold text-xs truncate`}
          title={`${t(locale, `body.form.labels.date`)}: `}
          value={
            entity.day > -1
              ? entity.day.toString()
              : t(locale, `body.form.labels.withoutDate`)
          }
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <DescPBlock
          outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
          valueStyle={`font-semibold text-xs truncate ${
            entity.type === "income" ? "text-green-600" : "text-red-500"
          }`}
          title={`${t(locale, `body.form.operations.amount`)}: `}
          value={decimalToInputString(entity.amount)}
        />
        {trackerTags && (
          <DescPBlock
            outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
            valueStyle={`font-semibold text-xs truncate`}
            title={`${t(locale, `body.form.operations.labelTags`)}: `}
            value={entity.tags.map((t) => trackerTags[t])}
          />
        )}
      </div>
      <DescPBlock
        outerStyle="col-span-2 flex flex-row gap-2 justify-start items-start"
        valueStyle={`font-semibold text-xs truncate`}
        title={`${t(locale, `body.form.operations.description`)}: `}
        value={entity.description}
      />
    </div>
  );
};

export default RecordDeleteBlock;
