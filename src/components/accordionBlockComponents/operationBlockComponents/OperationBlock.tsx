/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Operation } from "@/types/formTypes";
import OperationDescriptionBlock from "./OperationDescriptionBlock";
import OperationButtonBlock from "./OperationButtonBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { ModalBodyType, useModal } from "@/context/ModalContext";

type OperationBlockProps = {
  yearId: number;
  monthId: number;
  operation: Operation;
};

const OperationBlock: React.FC<OperationBlockProps> = ({
  yearId,
  monthId,
  operation,
}) => {
  const { locale } = useGlobal();
  const { setIsModal, setFormModalBody } = useModal();

  const handleCallFormModal = (modalType: ModalBodyType) => {
    setIsModal(true);
    setFormModalBody({
      type: modalType,
      yearId: yearId,
      monthId: monthId,
      operation: operation,
    });
  };

  return (
    <div className="cost grid gap-2 w-full">
      <div className="grid grid-cols-6 gap-3 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <OperationDescriptionBlock
          labelOperationTags={`${t(
            locale,
            `body.form.operations.labelTags`
          )}: `}
          labelOperationDescription={`${t(
            locale,
            `body.form.operations.description`
          )}: `}
          labelOperationAmount={`${t(locale, `body.form.operations.amount`)}: `}
          operationType={operation.type}
          operationTags={operation.tags}
          operationDescription={operation.description}
          operationAmount={operation.amount}
        />
        <OperationButtonBlock
          outerStyle={`col-span-1`}
          iconSize={"h-4 w-4"}
          buttonSize={"h-6 w-8"}
          handleCallFormModal={handleCallFormModal}
        />
      </div>
    </div>
  );
};

export default OperationBlock;
