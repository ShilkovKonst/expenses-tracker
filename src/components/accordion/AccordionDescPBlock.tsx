"use client";
import React from "react";

type AccordionDescPBlockProps = {
  outerStyle?: string;
  spanStyle: string;
  label: string;
  value: string | number;
};

const AccordionDescPBlock: React.FC<AccordionDescPBlockProps> = ({
  outerStyle,
  spanStyle,
  label,
  value,
}) => {
  return (
    <div className={`${outerStyle} flex flex-col justify-center`}>
      <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className={`font-semibold ${spanStyle}`}>{value}</span>
    </div>
  );
};

export default AccordionDescPBlock;
