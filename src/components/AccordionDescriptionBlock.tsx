"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  isSticky?: boolean;
  isMonth?: boolean;
};

const AccordionDescriptionBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
  isSticky,
  isMonth,
}) => {
  const { locale, selectedTag } = useGlobal();
  return (
    <div
      className={`${
        !isSticky ? "grid-cols-2" : "grid-cols-5"
      } pl-4 py-2 col-span-5 grid  md:grid-cols-5 gap-2 my-auto`}
    >
      <div
        className={`${
          !isMonth && isSticky ? "col-span-2" : "col-span-1"
        }  flex justify-start items-center`}
      >
        <h3
          className={`${
            !isSticky ? "text-base" : "text-xs sm:text-sm"
          } font-bold text-blue-800 capitalize flex flex-row justify-start items-center gap-1`}
        >
          {!isMonth && isSticky && (
            <span className="max-w-20 truncate lg:max-w-max">
              {selectedTag.type === "default"
                ? t(locale, "body.form.costsTagDefault")
                : selectedTag.type}
            </span>
          )}
          <span>{labelMain}</span>
        </h3>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {t(locale, `body.form.labels.budget`)} :
            </span>
          </div>
        )}
        <span
          className={`${
            !isSticky ? "text-base " : "text-sm"
          } font-bold text-green-600 text-sm`}
        >
          {budget}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {t(locale, `body.form.costs`)} :
            </span>
          </div>
        )}
        <span
          className={`${
            !isSticky ? "text-base " : "text-sm "
          } font-bold text-red-600 text-sm`}
        >
          {costs}
        </span>
      </div>
      <div className="flex flex-col justify-center">
        {!isSticky && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              {t(locale, `body.form.labels.balance`)} :
            </span>
          </div>
        )}
        <span
          className={`${
            !isSticky ? "text-base " : "text-sm "
          } font-bold text-red-500 text-sm`}
        >
          {balance}
        </span>
      </div>
    </div>
  );
};

export default AccordionDescriptionBlock;
