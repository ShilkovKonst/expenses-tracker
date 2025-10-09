"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";

type AccordionDescriptionPropsType = {
  labelMain: string;
  budget: number;
  costs: number;
  balance: number;
  isSticky?: boolean;
};

const AccordionDescriptionBlock: React.FC<AccordionDescriptionPropsType> = ({
  labelMain,
  budget,
  costs,
  balance,
  isSticky,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${
        !isSticky ? "grid-cols-2" : "grid-cols-4"
      } pl-4 py-2 col-span-4 grid  md:grid-cols-4 gap-2 my-auto`}
    >
      <div className="col-span-1 flex justify-start items-center">
        <h3
          className={`${
            !isSticky ? "text-base" : "text-xs sm:text-sm md:text-base"
          } font-bold text-blue-800 capitalize flex justify-start items-center`}
        >
          {labelMain}
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
          } font-bold text-green-600 text-base lg:text-lg`}
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
          } font-bold text-red-600 text-base lg:text-lg`}
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
          } font-bold text-red-500 text-base lg:text-lg`}
        >
          {balance}
        </span>
      </div>
    </div>
  );
};

export default AccordionDescriptionBlock;
