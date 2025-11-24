"use client";
import { memo } from "react";
import { DescH3Props } from "./types";

function DescH3Block({ label, totalRecords }: DescH3Props) {
  return (
    <div className={`col-span-1 flex justify-start items-center`}>
      <h3 className={`text-sm font-bold text-blue-800 capitalize`}>
        {label} ({totalRecords})
      </h3>
    </div>
  );
}

export default memo(DescH3Block);
