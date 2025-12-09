"use client";
import DescPBlock from "../../descriptionComponents/DescPBlock";
import { useGlobal } from "@/context/GlobalContext";
import { t } from "@/locales/locale";

type TagDeleteProps = {
  entity: { id: number; title: string };
};

const TagDeleteBlock = ({ entity }: TagDeleteProps) => {
  const { locale } = useGlobal();

  return (
    <div className="col-span-2 flex flex-col sm:flex-row gap-2 justify-center items-start mb-3">
      <DescPBlock
        outerStyle="col-span-2 flex flex-row gap-2 justify-start items-start"
        valueStyle={`font-semibold text-xs truncate`}
        title={`${t(locale, `body.form.operations.description`)}: `}
        value={entity.title}
      />
    </div>
  );
};

export default TagDeleteBlock;
