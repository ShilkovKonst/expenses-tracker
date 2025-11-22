"use client";
import { MonthRecord } from "@/lib/types/dataTypes";
import FormInputBlock from "../formComponents/FormInputBlock";
import MidLevelButton from "../buttonComponents/MidLevelButton";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import { ChangeEvent, useEffect, useState } from "react";
import FormRadioBlock from "@/components/formComponents/FormRadioBlock";
import FormTagsBlock from "@/components/formComponents/FormTagsBlock";
import DescPBlock from "../accordionBlockComponents/DescPBlock";
import { useModal } from "@/context/ModalContext";
import { MONTHS } from "@/constants";
import FormSelectBlock from "../formComponents/FormSelectBlock";
import { getMonthDays } from "@/lib/utils/monthHelper";
import {
  calcExpression,
  decimalToInputString,
  parseInputAmountToDecimal,
  trimLeadingZeros,
} from "@/lib/utils/amountHelper";
import { useModalBody } from "@/hooks/useModalBody";
import { createRecord, updateRecord } from "@/idb/recordsCRUD";
import { useTracker } from "@/context/TrackerContext";
import { updateMeta } from "@/lib/utils/updateDeleteHelper";

type RecordFormProps = {
  handleUpdate: (record: MonthRecord, isDelete: boolean) => void;
};

const RecordForm: React.FC<RecordFormProps> = ({ handleUpdate }) => {
  const { locale } = useGlobal();
  const { handleClear } = useModal();
  const { trackerId, trackerMeta, setTrackerMeta } = useTracker();

  const [currentRecord, setCurrentRecord] = useState<MonthRecord | undefined>(
    undefined
  );
  const [amountString, setAmountString] = useState<string>("0");
  const [isCalcMode, setIsCalcMode] = useState<boolean>(false);

  const { recordBody } = useModalBody();

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
        normalizedValue = currentRecord ? currentRecord.tags : [];
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

  useEffect(() => {
    if (recordBody) {
      setCurrentRecord(recordBody.record);
      setAmountString(decimalToInputString(recordBody.record.amount));
    }
  }, [recordBody]);

  const handleCalcClick = (value: string) => {
    if (currentRecord) {
      const newAmount = calcExpression(value);
      setAmountString(newAmount.toString());
      setIsCalcMode(false);
    }
  };

  const handleUpdateClick = async () => {
    if (recordBody && currentRecord) {
      const updCurrentRecord: MonthRecord = {
        ...currentRecord,
        amount: parseInputAmountToDecimal(amountString),
      };
      if (recordBody.type === "crt") {
        try {
          const recordId = await createRecord(trackerId, updCurrentRecord);
          updCurrentRecord.id = recordId;
          if (trackerMeta)
            await updateMeta(trackerId, trackerMeta, setTrackerMeta);
        } catch {
          throw new Error("'Create record' transaction failed!");
        }
      }
      if (recordBody.type === "upd") {
        try {
          await updateRecord(trackerId, updCurrentRecord);
          if (trackerMeta)
            await updateMeta(trackerId, trackerMeta, setTrackerMeta);
        } catch {
          throw new Error("'Update record' transaction failed!");
        }
      }
      handleUpdate(updCurrentRecord, false);
    }
  };

  return (
    <form className="form grid grid-cols-2 gap-2">
      {recordBody && (
        <p className="col-span-2 text-lg text-center font-bold mx-auto">
          {recordBody.type === "upd"
            ? t(locale, "body.modal.titleUpdate")
            : t(locale, "body.modal.titleCreate")}
        </p>
      )}
      {currentRecord && (
        <>
          <div className="col-span-2 grid grid-cols-2 gap-2 *:border-l *:border-b *:border-blue-200">
            <DescPBlock
              outerStyle="flex flex-row items-center gap-2 *:text-black *:font-semibold pl-1"
              spanStyle={`text-xs truncate`}
              label={`${t(locale, `body.form.labels.year`)}: `}
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
              name="date"
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
            // handleClick={() => handleUpdate(currentRecord, false)}
            handleClick={handleUpdateClick}
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
