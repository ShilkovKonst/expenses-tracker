"use client";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent } from "react";

type FormRadioProps = {
  labelRadio: string;
  name: string;
  outerStyle: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormRadioBlock: React.FC<FormRadioProps> = ({
  id,
  name,
  value,
  outerStyle,
  labelRadio,
  styleLabel,
  styleInput,
  handleChange,
}) => {
  const { locale } = useGlobal();
  return (
    <div
      className={`${outerStyle} flex gap-1 md:gap-3 justify-start items-center`}
    >
      <p className={`${styleLabel} font-semibold uppercase`}>{labelRadio}</p>
      <div className="w-full flex justify-evenly gap-1 md:gap-2">
        {["income", "cost"].map((type, i) => (
          <div key={i} className={`flex items-center ${type === "income" ? "order-1" : "order-3"}`}>
            <input
              type="radio"
              id={`${id}-${type}`}
              value={type}
              name={name}
              checked={value === type}
              onChange={handleChange}
              className="input-radio"
              required
            />
            <label
              htmlFor={`${id}-${type}`}
              className={`${styleInput} font-light text-black uppercase`}
            >
              {`${t(locale, `body.form.labels.${type}`)}`}
            </label>
          </div>
        ))}
        <div className="h-auto border-l border-blue-300 order-2"/>
      </div>
    </div>
  );
};

export default FormRadioBlock;
