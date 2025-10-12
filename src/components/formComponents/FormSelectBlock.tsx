import { useGlobal } from "@/app/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent } from "react";

type FormSelectBlockPropsType = {
  id: string;
  style: string;
  value: string | number;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const FormSelectBlock: React.FC<FormSelectBlockPropsType> = ({
  id,
  style,
  value,
  options,
  onChange,
}) => {
  const { locale } = useGlobal();
  return (
    <div className="flex gap-2 justify-between items-center w-full col-span-2">
      <select
        id={id}
        className={`w-full border-2 border-blue-100 rounded-md transition-colors duration-200 bg-white ${style}`}
        required
        value={value}
        onChange={(e) => onChange(e)}
      >
        {options.map((o, i) => (
          <option key={i} value={o}>
            {o === "default" ? t(locale, `body.form.data.typeDefault`) : o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectBlock;
