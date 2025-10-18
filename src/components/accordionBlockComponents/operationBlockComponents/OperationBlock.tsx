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
      <div className="pl-4 pr-2 py-2 grid grid-cols-6 gap-2 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <OperationDescriptionBlock
          outerStyle="col-span-5 grid grid-cols-4 gap-2 md:gap-4 my-auto"
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
