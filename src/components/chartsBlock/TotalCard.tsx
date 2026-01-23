"use client";
import { useGlobal } from "@/context/GlobalContext";
import { MoneyIcon, RecordsIcon, TagIcon } from "@/lib/icons";
import { TagId } from "@/lib/types/brand";
import { t } from "@/locales/locale";

type Props = {
  selectedTag: TagId;
  card: {
    title: string[];
    value: (string | number)[];
  };
};

const TotalCard = ({ selectedTag, card }: Props) => {
  const { locale } = useGlobal();

  const testStyle = (idx: number) =>
    idx < 2 ? "text-blue-800" : idx === 2 ? "text-red-800" : "text-green-800";

  return (
    <div className="bg-blue-200 border-2 border-blue-300 px-2 py-1 text-left">
      <div className="flex flex-col gap-1 justify-start items-start">
        <p className="text-gray-600 my-auto">
          {t(locale, "body.charts.total")}:
        </p>
        <div
          className={`flex ${selectedTag === -1 ? "flex-col justify-center items-start gap-1 " : "flex-row justify-start items-center gap-3"}`}
        >
          {[0, 1, 2, 3].map(
            (i) =>
              card.value[i] !== 0 &&
              card.value[i] !== "0,00" && (
                <div
                  key={i}
                  className={`flex gap-1 *:text-xs ${selectedTag !== -1 ? "border-b border-l border-blue-300 p-1" : ""}`}
                >
                  <p className="font-normal text-gray-600">{card.title[i]}:</p>
                  <p className={`${testStyle(i)} font-semibold`}>
                    {card.value[i]}
                  </p>
                  {i === 0 ? (
                    <RecordsIcon
                      className={`${testStyle(i)} font-semibold h-5 w-5`}
                    />
                  ) : i === 1 ? (
                    <TagIcon
                      className={`${testStyle(i)} font-semibold h-5 w-5`}
                    />
                  ) : (
                    <MoneyIcon
                      className={`${testStyle(i)} font-semibold h-5 w-5`}
                    />
                  )}
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
