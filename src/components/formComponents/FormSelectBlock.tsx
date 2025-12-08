import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent } from "react";

type FormSelectBlockPropsType = {
  id: string;
  outerStyle: string;
  titleStyle: string;
  style: string;
  label: string;
  name: string;
  value: number;
  options: number[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const FormSelectBlock: React.FC<FormSelectBlockPropsType> = ({
  id,
  outerStyle,
  titleStyle,
  style,
  label,
  name,
  value,
  options,
  onChange,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${outerStyle} flex gap-2 justify-start items-center w-full`}
    >
      <p
        className={`${titleStyle} text-xs font-medium uppercase tracking-wide`}
      >
        {label}
      </p>
      <select
        id={id}
        className={`border-2 border-blue-100 focus:outline-blue-300 focus:border-blue-300 rounded-md text-sm bg-white ${style} w-full`}
        required
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
      >
        <option value={-1}>
          {t(locale, `body.form.placeholders.recordDay`)}
        </option>
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectBlock;
