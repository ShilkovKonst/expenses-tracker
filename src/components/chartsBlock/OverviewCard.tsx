"use client";
import { useTracker } from "@/context/TrackerContext";
import { MoneyIcon, RecordsIcon } from "@/lib/icons";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { TagObj } from "./OverviewBlock";

type OverviewCardProps = {
  card: {
    title: string;
    value: TagObj[];
    valueStyle: string;
    isRecords?: boolean;
    parseToDecimal?: boolean;
  };
};

const OverviewCard = ({ card }: OverviewCardProps) => {
  const { trackerTags } = useTracker();

  return (
    <div className="bg-blue-200 border-2 border-blue-300 px-2 py-1 text-left">
      <div className="flex flex-col gap-1 justify-start items-start *:flex *:gap-1 *:justify-start *:items-center">
        <p className="text-gray-600 my-auto">{card.title}:</p>
        {card.value.map((v, i) => (
          <div
            key={i}
            className={`${card.valueStyle} *:font-semibold *:text-xs`}
          >
            <p className="truncate sm:max-w-16 md:max-w-none xl:max-w-20 2xl:max-w-40">
              {trackerTags ? trackerTags[v.tagId] : v.tagId}
            </p>
            <p>
              - {card.parseToDecimal ? decimalToInputString(v.value) : v.value}
            </p>
            {card.parseToDecimal ? (
              <MoneyIcon className="h-5 w-5" />
            ) : (
              <RecordsIcon className="h-5 w-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCard;
