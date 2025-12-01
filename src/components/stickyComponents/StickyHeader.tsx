"use client";
import HeaderButtonBlock from "../accordionBlockComponents/HeaderButtonBlock";
import { useModal } from "@/context/ModalContext";
import { useTracker } from "@/context/TrackerContext";
import { updateMetadata } from "@/idb/CRUD/metaCRUD";
import { createRecord } from "@/idb/CRUD/recordsCRUD";
import { MonthRecord } from "@/lib/types/dataTypes";
import Link from "next/link";
import { useCallback } from "react";

type StickyHeaderProps = {
  labelMain: string;
  totalAmount: number | string;
  expandDataType: string;
  isMonth: boolean;
  expandDisabled?: boolean;
  yearId?: number;
  monthId?: number;
  recordsLength?: number;
};

const StickyHeader = ({
  labelMain,
  totalAmount,
  expandDataType,
  isMonth,
  expandDisabled,
  yearId,
  monthId,
  recordsLength,
}: StickyHeaderProps) => {
  const { openModal } = useModal();
  const { trackerId } = useTracker();

  const handleAddOperation = useCallback(() => {
    if (yearId && monthId) {
      const newRecord: MonthRecord = {
        id: -1,
        year: yearId,
        month: monthId,
        day: -1,
        type: "cost",
        tags: [],
        description: "",
        amount: 0,
      };
      const onCreate = async (record: MonthRecord) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...partRecord } = record;
        const newId = await createRecord(trackerId, partRecord);
        const updatedAt = await updateMetadata(trackerId);
        return { id: newId, updatedAt };
      };
      openModal("record", { record: newRecord, onConfirm: onCreate });
    }
  }, [monthId, openModal, trackerId, yearId]);

  return (
    <div
      className={`header col-span-6 grid grid-cols-7 gap-2 w-full border-2 ${
        isMonth
          ? "bg-blue-100 border-blue-200 border-t-0 sticky top-10 z-10"
          : "bg-blue-200 border-blue-300 sticky top-0 z-20"
      }`}
    >
      <Link
        href={isMonth ? `#${yearId}-${monthId}-body` : `#${yearId}`}
        className={`grid-cols-5 pl-2 py-2 col-span-5 grid md:grid-cols-5 gap-2 my-auto`}
      >
        <StickyDescH3Block
          label={labelMain}
          recordsLength={recordsLength}
          isMonth={isMonth}
        />
        <StickyDescPBlock
          spanStyle={
            Number(totalAmount) >= 0 ? "text-green-600" : "text-red-600"
          }
          value={totalAmount}
        />
      </Link>
      <HeaderButtonBlock
        expandDataType={expandDataType}
        expandDisabled={expandDisabled}
        isMonth={isMonth}
        handleAddOperation={handleAddOperation}
      />
    </div>
  );
};

export default StickyHeader;

type StickyDescH3BlockProps = {
  isMonth?: boolean;
  recordsLength?: number;
  label: string;
};

const StickyDescH3Block: React.FC<StickyDescH3BlockProps> = ({
  isMonth,
  recordsLength,
  label,
}) => {
  const { trackerId } = useTracker();
  return (
    <div className={`col-span-2 flex justify-start items-center`}>
      <h3
        className={`text-xs sm:text-sm font-bold text-blue-800 capitalize flex flex-row justify-start items-center gap-1`}
      >
        {!isMonth && (
          <span className="max-w-20 truncate lg:max-w-max">{trackerId}</span>
        )}
        <span>
          {label} {recordsLength && `(${recordsLength})`}
        </span>
      </h3>
    </div>
  );
};

type StickyDescPBlockProps = {
  spanStyle: string;
  value: string | number;
};

const StickyDescPBlock: React.FC<StickyDescPBlockProps> = ({
  spanStyle,
  value,
}) => {
  return (
    <div className={`flex flex-col justify-center`}>
      <span className={`font-semibold text-sm ${spanStyle}`}>{value}</span>
    </div>
  );
};
