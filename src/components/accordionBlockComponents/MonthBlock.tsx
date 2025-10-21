"use client";
import { useEffect, useState } from "react";
import { Month } from "@/types/formTypes";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";
import HeaderBlock from "./HeaderBlock";
import OperationBlock from "./operationBlockComponents/OperationBlock";
import { useModal } from "@/context/ModalContext";

type MonthBlockProps = {
  yearId: number;
  month: Month;
};

const MonthBlock: React.FC<MonthBlockProps> = ({ yearId, month }) => {
  const { locale } = useGlobal();
  const { setIsModal, setFormModalBody } = useModal();

  const [isExpandDisabled, setIsExpandDisabled] = useState<boolean>(true);

  const handleAddOperation = () => {
    setIsModal(true);
    setFormModalBody({
      type: "crt",
      yearId: yearId,
      monthId: month.id,
      record: {
        id: `${yearId}-${month.id}-${month.operations.length}`,
        type: "cost",
        tags: [],
        description: "",
        amount: 0,
      },
    });
  };

  useEffect(() => {
    setIsExpandDisabled(month.operations?.length === 0);
  }, [month.operations]);

  return (
    <div
      key={month.id}
      id={`${yearId}-${month.id}-body`}
      data-month-body={yearId}
      data-month-id={month.id}
      data-year-id={yearId}
      className="month grid grid-cols-6 gap-2 w-full"
    >
      <HeaderBlock
        dataId={`${yearId}-${month.id}-header`}
        dataHeader={yearId.toString()}
        labelMain={`${t(locale, `body.form.valueMonth.${month.title}`)}`}
        totalAmount={month.totalAmount}
        expandDataType={`${yearId}-${month.id}`}
        isMonth={true}
        expandDisabled={isExpandDisabled}
        handleAddOperation={handleAddOperation}
      />
      <div
        id={`${yearId}-${month.id}`}
        style={{ height: 0 }}
        className="col-span-6 grid gap-2 pl-2 transition-[height] duration-300 ease-in-out overflow-hidden w-full"
      >
        {month.operations.map((operation, index) => (
          <OperationBlock
            key={index}
            yearId={yearId}
            monthId={month.id}
            operation={operation}
          />
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default MonthBlock;
