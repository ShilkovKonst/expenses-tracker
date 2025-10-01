import { getMonthIdByTitle } from "@/lib/utils/monthHelper";
import { Locale, t } from "@/locales/locale";
import { Months } from "@/types/formTypes";
import { ChangeEvent } from "react";

type FormSelectBlockPropsType = {
  locale: Locale;
  titleLable?: string;
  titleOptionsInit?: string;
  titleOptions?: string;
  id: string;
  style: string;
  value: string | number;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  withLabel: boolean;
};

const FormSelectBlock: React.FC<FormSelectBlockPropsType> = ({
  locale,
  titleLable,
  titleOptionsInit,
  titleOptions,
  id,
  style,
  value,
  options,
  onChange,
  withLabel,
}) => {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      {withLabel && (
        <label
          className="block font-bold text-blue-900 mb-1 text-lg uppercase"
          htmlFor={id}
        >
          {t(locale, `body.form.${titleLable}`)}
        </label>
      )}
      <select
        id={id}
        className={`w-full border-2 border-blue-100 rounded-md transition-colors duration-200 bg-white ${style}`}
        required
        value={value}
        onChange={(e) => onChange(e)}
      >
        {withLabel && (
          <option value={""}>
            {t(locale, `body.form.${titleOptionsInit}`)}
          </option>
        )}
        {options.map((o, i) => (
          <option
            key={i}
            value={withLabel ? getMonthIdByTitle(o as Months) : o}
          >
            {withLabel
              ? t(locale, `body.form.${titleOptions}.${o}`)
              : o === "home"
              ? t(locale, `body.form.expensesTagHome`)
              : o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectBlock;
