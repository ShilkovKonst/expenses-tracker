"use client";
import { memo } from "react";
import { BasePBlock } from "./BasePBlock";
import { OkIcon, WarningIcon } from "@/lib/icons";
import { DescDateProps } from "./types";

function DescDateBlock({
  title,
  value,
  isOutdated,
  outerStyle,
  titleStyle,
  valueStyle,
}: DescDateProps) {
  return (
    <BasePBlock title={title} outerStyle={outerStyle} titleStyle={titleStyle}>
      {typeof isOutdated === "undefined" ? (
        <span className={`${valueStyle} font-medium p-1`}>{value}</span>
      ) : isOutdated ? (
        <span className={`${valueStyle} font-medium p-1`}>
          {value}
          <WarningIcon className="h-4 w-4 absolute top-[calc(50%-0.5rem)] bottom-0 right-0" />
        </span>
      ) : (
        <span className={`${valueStyle} font-medium p-1`}>
          {value}
          <OkIcon className="h-4 w-4 absolute top-[calc(50%-0.5rem)] bottom-0 right-0" />
        </span>
      )}
    </BasePBlock>
  );
}

export default memo(DescDateBlock);
