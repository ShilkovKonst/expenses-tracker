"use client";
import { useGlobal } from "@/context/GlobalContext";
import DescPBlock from "../../descriptionComponents/DescPBlock";
import { t } from "@/locales/locale";

type TrackerDeleteProps = {
  entityType: string;
  entity: { trackerId: string };
};

const TrackerDeleteBlock = ({ entityType, entity }: TrackerDeleteProps) => {
  const { locale } = useGlobal();

  return (
    <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
      <DescPBlock
        outerStyle="col-span-2 flex flex-row gap-2 justify-start items-start"
        valueStyle={`font-semibold text-xs truncate`}
        title={`${t(locale, `body.modal.descDelete`, {
          deleteEntity: t(locale, `body.modal.deleteEntity.${entityType}`),
          deleteEntityId: entity.trackerId,
        })}`}
        value={""}
      />
    </div>
  );
};

export default TrackerDeleteBlock;
