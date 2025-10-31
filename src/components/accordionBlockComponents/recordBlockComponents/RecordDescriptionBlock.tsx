import DescPBlock from "../DescPBlock";

type RecordDescriptionBlockProps = {
  outerStyle: string;
  labelRecordTags: string;
  labelRecordDescription: string;
  labelRecordAmount: string;
  labelRecordDate: string;
  recordType: string;
  recordTags: string[] | string;
  recordDescription: string;
  recordAmount: number;
  recordDate: number | string;
};

const RecordDescriptionBlock: React.FC<RecordDescriptionBlockProps> = ({
  outerStyle,
  labelRecordTags,
  labelRecordDescription,
  labelRecordAmount,
  labelRecordDate,
  recordType,
  recordTags,
  recordDescription,
  recordAmount,
  recordDate,
}) => {
  return (
    <div className={outerStyle}>
      <div className="col-span-2 md:row-span-2 md:col-span-1 grid gap-2">
        {recordDate && (
          <DescPBlock
            outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
            spanStyle={`text-xs truncate`}
            label={`${labelRecordDate}`}
            value={`${recordDate}`}
          />
        )}
        <DescPBlock
          outerStyle="col-span-1 flex flex-row gap-2 justify-start items-start"
          spanStyle={`${
            recordType === "income" ? "text-green-600" : "text-red-500"
          } text-xs truncate`}
          label={labelRecordAmount}
          value={recordAmount}
        />
      </div>

      <DescPBlock
        outerStyle="col-span-2 md:col-span-3 flex flex-row gap-2 justify-start items-start"
        spanStyle="text-xs"
        label={labelRecordTags}
        value={recordTags}
      />
      <DescPBlock
        outerStyle="col-span-4 md:col-span-3 flex flex-row gap-2 justify-start items-start"
        spanStyle="text-xs"
        label={labelRecordDescription}
        value={recordDescription}
      />
    </div>
  );
};

export default RecordDescriptionBlock;
