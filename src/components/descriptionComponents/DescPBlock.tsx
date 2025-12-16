"use client";
import { compare } from "@/lib/utils/compareHelper";
import { DescPProps } from "./types";
import { memo, useMemo } from "react";
import { BasePBlock, renderText, renderTextList } from "./BasePBlock";

function DescPBlock({
  title,
  value,
  outerStyle,
  titleStyle = "text-gray-600 font-medium",
  valueStyle,
}: DescPProps) {
  const processedValues = useMemo(() => {
    if (!Array.isArray(value)) return value;
    return [...value].sort(compare);
  }, [value]);
  
  return (
    <BasePBlock title={title} outerStyle={outerStyle} titleStyle={titleStyle}>
      {typeof processedValues === "string"
        ? renderText(processedValues, valueStyle)
        : renderTextList(processedValues, valueStyle)}
    </BasePBlock>
  );
}

export default memo(DescPBlock);
