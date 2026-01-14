"use client";
import { useGlobal } from "@/context/GlobalContext";
import { MoneyIcon, RecordsIcon, TagIcon } from "@/lib/icons";
import { t } from "@/locales/locale";

type Props = {
  card: {
    title: string[];
    value: (string | number)[];
  };
};

const TotalCard = ({ card }: Props) => {
  const { locale } = useGlobal();

  const testStyle = (idx: number) =>
    idx < 2 ? "text-blue-800" : idx === 2 ? "text-red-800" : "text-green-800";

  return (
    <div className="bg-blue-200 border-2 border-blue-300 px-2 py-1 text-left">
      <div className="flex flex-col gap-1 justify-start items-start *:flex *:gap-1 *:justify-start *:items-center">
        <p className="text-gray-600 my-auto">
          {t(locale, "body.charts.total")}:
        </p>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`*:text-xs`}>
            <p className="font-normal text-gray-600">{card.title[i]}:</p>
            <p className={`${testStyle(i)} font-semibold`}>{card.value[i]}</p>
            {i === 0 ? (
              <RecordsIcon
                className={`${testStyle(i)} font-semibold h-5 w-5`}
              />
            ) : i === 1 ? (
              <TagIcon className={`${testStyle(i)} font-semibold h-5 w-5`} />
            ) : (
              <MoneyIcon className={`${testStyle(i)} font-semibold h-5 w-5`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalCard;
