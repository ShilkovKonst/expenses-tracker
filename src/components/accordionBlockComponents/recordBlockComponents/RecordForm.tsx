"use client";
import { Record } from "@/types/formTypes";
import FormInputBlock from "../../formComponents/FormInputBlock";
import MidLevelButton from "../../buttonComponents/MidLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent, useEffect, useState } from "react";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";
import DescPBlock from "../DescPBlock";
import { useModal } from "@/context/ModalContext";
import { MONTHS } from "@/lib/constants";
import FormSelectBlock from "../../formComponents/FormSelectBlock";
import { getMonthDays } from "@/lib/utils/monthHelper";
import { calcExpression, regexAmount } from "@/lib/utils/recordAmountHelper";

type RecordFormProps = {
  handleUpdate: (record: Record, isDelete: boolean) => void;
  handleClear: () => void;
};

const RecordForm: React.FC<RecordFormProps> = ({
  handleUpdate,
  handleClear,
}) => {
  const { locale } = useGlobal();
  const { formModalBody } = useModal();

  const [currentRecord, setCurrentRecord] = useState<Record | undefined>(
    undefined
  );
  const [currentYearMonth, setCurrentYearMonth] = useState<number[]>([]);
  const [isCalcMode, setIsCalcMode] = useState<boolean>(false);

  const handleOperationChange = <K extends keyof Record>(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let regexValue = value;
    if (name === "amount") {
      regexValue = regexAmount(value);
      if (regexValue.slice(1).match(/[+\-*\/]\d+/g) && !isCalcMode)
        setIsCalcMode(true);
      if (!regexValue.slice(1).match(/[+\-*\/]\d+/g) && isCalcMode)
        setIsCalcMode(false);
    }
    if (currentRecord)
      setCurrentRecord({
        ...currentRecord,
        [name as K]: regexValue as Record[K],
      });
  };

  useEffect(() => {
    if (formModalBody?.record) {
      setCurrentRecord(formModalBody.record);
      setCurrentYearMonth([formModalBody.yearId, formModalBody.monthId]);
    }
  }, [formModalBody]);

  const handleCalcClick = (value: string) => {
    if (currentRecord) {
      const newAmount = calcExpression(value);
      setCurrentRecord({ ...currentRecord, amount: newAmount });
      setIsCalcMode(false);
    }
  };

  return (
    <form className="form grid grid-cols-2 gap-2">
      {formModalBody && (
        <p className="col-span-2 text-lg text-center font-bold mx-auto">
          {formModalBody.type === "upd"
            ? t(locale, "body.modal.labelTitleUpdate")
            : t(locale, "body.modal.labelTitleCreate")}
        </p>
      )}
      {currentRecord && (
        <>
          <div className="col-span-2 grid grid-cols-2 gap-2 *:border-l *:border-b *:border-blue-200">
            <DescPBlock
              outerStyle="flex flex-row items-center gap-2 *:text-black *:font-semibold pl-1"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.labels.year`)}: `}
              value={`${currentYearMonth[0]}, ${t(
                locale,
                `body.form.valueMonth.${MONTHS[currentYearMonth[1] - 1]}`
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
              name="date"
              value={currentRecord.date ?? -1}
              options={getMonthDays(currentYearMonth[0], currentYearMonth[1])}
              onChange={handleOperationChange}
            />
            <FormInputBlock
              name={"amount"}
              title={`${t(locale, `body.form.operations.amount`)}:`}
              id={"operationAmountInput" + currentRecord?.id}
              value={
                currentRecord.amount ? currentRecord.amount?.toString() : "0"
              }
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
            styleLabel={"text-xs"}
            styleInput={"px-2 py-1 text-sm"}
          />
          <FormInputBlock
            name={"description"}
            title={t(locale, `body.form.operations.description`)}
            id={"operationDescInput" + currentRecord?.id}
            value={currentRecord.description}
            handleChange={handleOperationChange}
            disabled={false}
            required={false}
            outerStyle="col-span-2"
            styleLabel={"text-xs"}
            styleInput={"px-2 text-sm"}
          />
          <MidLevelButton
            title={t(locale, "body.modal.labelConfirm")}
            style="bg-green-300 hover:bg-green-400 border-green-400 cols-span-1 disabled:text-gray-600 disabled:bg-green-200 disabled:hover:bg-green-200 disabled:border-green-300"
            handleClick={() => handleUpdate(currentRecord, false)}
          />
        </>
      )}
      <MidLevelButton
        title={t(locale, "body.modal.labelCancel")}
        style="bg-blue-300 hover:bg-blue-400 border-blue-400 cols-span-1"
        handleClick={handleClear}
      />
    </form>
  );
};

export default RecordForm;
