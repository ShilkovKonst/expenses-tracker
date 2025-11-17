"use client";
import { MonthRecord } from "@/types/formTypes";
import RecordDescriptionBlock from "./RecordDescriptionBlock";
import RecordButtonBlock from "./RecordButtonBlock";
import { t } from "@/locales/locale";
import { useGlobal } from "@/context/GlobalContext";
import { RecordModalType, useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";

type RecordProps = {
  yearId: number;
  monthId: number;
  record: MonthRecord;
};

const RecordBlock: React.FC<RecordProps> = ({ yearId, monthId, record }) => {
  const { locale } = useGlobal();
  const { trackerTags } = useTracker();
  const { setIsModal, setModalBody, setModalType } = useModal();

  const handleCallFormModal = (modalType: RecordModalType) => {
    setIsModal(true);
    setModalType("recordFormBlock");
    setModalBody({
      type: modalType,
      yearId: yearId,
      monthId: monthId,
      record: record,
    });
  };

  return (
    <div className="cost grid gap-2 w-full">
      <div className="pl-4 pr-2 py-2 grid grid-cols-6 gap-2 w-full bg-blue-50 hover:bg-blue-200 border-2 border-blue-100">
        <RecordDescriptionBlock
          outerStyle="col-span-5 grid grid-cols-4 gap-2 my-auto"
          labelRecordTags={`${t(locale, `body.form.operations.labelTags`)}: `}
          labelRecordDescription={`${t(
            locale,
            `body.form.operations.description`
          )}: `}
          labelRecordAmount={`${t(locale, `body.form.operations.amount`)}: `}
          labelRecordDate={`${t(locale, `body.form.labels.date`)}: `}
          recordType={record.type}
          recordTags={
            record.tags?.length > 0
              ? trackerTags
                ? record.tags.map((t) => trackerTags[t])
                : []
              : t(locale, "body.form.labels.withoutTags")
          }
          recordDescription={
            record.description.length > 0
              ? record.description
              : t(locale, "body.form.labels.withoutDesc")
          }
          recordAmount={record.amount}
          recordDate={
            record.date > -1
              ? record.date
              : t(locale, "body.form.labels.withoutDate")
          }
        />
        <RecordButtonBlock
          outerStyle={`col-span-1`}
          iconSize={"h-4 w-4"}
          buttonSize={"h-6 w-8"}
          handleCallFormModal={handleCallFormModal}
        />
      </div>
    </div>
  );
};

export default RecordBlock;
