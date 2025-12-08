"use client";
import { MonthRecord } from "@/lib/types/dataTypes";
import FormInputBlock from "../formComponents/FormInputBlock";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";
import { MONTHS } from "@/constants";
import FormSelectBlock from "../formComponents/FormSelectBlock";
import { getMonthDays } from "@/lib/utils/monthHelper";
import { calcExpression, trimLeadingZeros } from "@/lib/utils/amountHelper";
import DescPBlock from "../descriptionComponents/DescPBlock";

type RecordCreateUpdateProps = {
  currentRecord: MonthRecord;
  setCurrentRecord: Dispatch<SetStateAction<MonthRecord>>;
  amountString: string;
  setAmountString: Dispatch<SetStateAction<string>>;
};

const RecordCreateUpdateBlock = ({
  currentRecord,
  setCurrentRecord,
  amountString,
  setAmountString,
}: RecordCreateUpdateProps) => {
  const { locale } = useGlobal();
  const [isCalcMode, setIsCalcMode] = useState<boolean>(false);

  const handleOperationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof MonthRecord;
    let normalizedValue: MonthRecord[keyof MonthRecord];

    switch (key) {
      case "type":
      case "description":
        normalizedValue = value;
        break;
      case "day":
        const parsed = Number(value);
        normalizedValue = Number.isFinite(parsed) ? parsed : -1;
        break;
      case "amount":
        const trimmed = trimLeadingZeros(value);
        setAmountString(trimmed);
        const isExpr = /[+\-*\/]\d+/g.test(trimmed.slice(1));
        setIsCalcMode(isExpr);
        return;
      case "tags":
        normalizedValue = currentRecord.tags ?? [];
        break;
      default:
        return;
    }

    if (currentRecord) {
      setCurrentRecord({
        ...currentRecord,
        [key]: normalizedValue,
      });
    }
  };

  const handleCalcClick = (value: string) => {
    if (currentRecord) {
      const newAmount = calcExpression(value);
      setAmountString(newAmount.toString());
      setIsCalcMode(false);
    }
  };

  return (
    <>
      <div className="col-span-2 grid grid-cols-2 gap-2 *:border-l *:border-b *:border-blue-200">
        <DescPBlock
          outerStyle="flex flex-row items-center gap-2 *:text-black *:font-semibold pl-1"
          valueStyle={`font-semibold text-xs truncate`}
          title={`${t(locale, `body.form.labels.year`)}: `}
          value={`${currentRecord.year}, ${t(
            locale,
            `body.form.valueMonth.${MONTHS[currentRecord.month]}`
          )}`}
        />
        <FormRadioBlock
          outerStyle=" pl-1"
          id={"operationTypeInput" + currentRecord?.id}
          labelRadio={`${t(locale, `body.form.operations.type`)}:`}
          name={"type"}
          value={currentRecord.type}
          handleChange={handleOperationChange}
          styleLabel={"text-xs"}
          styleInput={"pl-1 py-1 text-xs"}
        />
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-2 *:border-l *:border-b *:border-blue-200">
        <FormSelectBlock
          id="daySelect"
          outerStyle=" py-1 pl-1"
          style=""
          titleStyle=" *:text-black font-semibold"
          label={`${t(locale, `body.form.labels.date`)}: `}
          name="day"
          value={currentRecord.day ?? -1}
          options={getMonthDays(currentRecord.year, currentRecord.month)}
          onChange={handleOperationChange}
        />
        <FormInputBlock
          name={"amount"}
          title={`${t(locale, `body.form.operations.amount`)}:`}
          id={"operationAmountInput" + currentRecord?.id}
          value={amountString ? amountString : "0"}
          handleChange={handleOperationChange}
          disabled={false}
          required={true}
          outerStyle="flex gap-2 justify-start items-center py-1 pl-1"
          styleLabel={"text-xs"}
          styleInput={"px-2"}
          isCalcMode={isCalcMode}
          handleCalc={handleCalcClick}
        />
      </div>
      <FormTagsBlock
        title={t(locale, `body.form.operations.labelTags`)}
        record={currentRecord}
        setRecord={setCurrentRecord}
        styleLabel={""}
        styleInput={"px-2 py-1 text-sm"}
      />
      <div className={`col-span-2 relative`}>
        <label
          className={`block font-semibold uppercase text-xs`}
          htmlFor={`operationDescInput${currentRecord?.id}`}
        >
          {t(locale, `body.form.operations.description`)}
        </label>
        <input
          id={`operationDescInput${currentRecord?.id}`}
          name="description"
          type="text"
          value={currentRecord.description}
          className="col-span-4 w-full px-2 py-1 border-2 bg-white border-blue-100 focus:outline-blue-300 rounded-md text-xs"
          placeholder={t(locale, `body.form.placeholders.newTag`)}
          onChange={(e) => handleOperationChange(e)}
        />
      </div>
    </>
  );
};

export default RecordCreateUpdateBlock;
