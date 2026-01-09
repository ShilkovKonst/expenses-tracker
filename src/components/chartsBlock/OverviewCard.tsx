"use client";
import { useTracker } from "@/context/TrackerContext";
import { MoneyIcon, RecordsIcon } from "@/lib/icons";
import { decimalToInputString } from "@/lib/utils/amountHelper";
import { TagObj } from "./OverviewBlock";

type OverviewCardProps = {
  card: {
    title: string;
    value: number | string | TagObj[];
    valueStyle: string;
    isRecords?: boolean;
    parseToDecimal?: boolean;
  };
};

const OverviewCard = ({ card }: OverviewCardProps) => {
  const { trackerTags } = useTracker();

  return (
    <div className="bg-blue-200 border-2 border-blue-300 px-2 py-1 text-left flex items-center justify-start gap-2">
      <div className="flex flex-wrap gap-1 justify-start items-center *:text-base *:flex *:gap-1 *:justify-start *:items-center">
        <p className="text-gray-600 my-auto">{card.title}:</p>
        {Array.isArray(card.value) ? (
          card.value.map((v, i) => (
            <div className={card.valueStyle} key={i}>
              <p>{trackerTags ? trackerTags[v.tagId] : v.tagId}</p> -
              <p>
                {card.parseToDecimal ? decimalToInputString(v.value) : v.value}
              </p>
              {card.parseToDecimal ? (
                <MoneyIcon className="h-5 w-5" />
              ) : (
                <RecordsIcon className="h-5 w-5" />
              )}
            </div>
          ))
        ) : (
          <div className={card.valueStyle}>
            <p>{card.value}</p>
            {card.isRecords ? (
              <RecordsIcon className="h-5 w-5" />
            ) : (
              <MoneyIcon className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
