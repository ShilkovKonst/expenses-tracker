"use client";
import { compare } from "@/lib/utils/compareHelper";

type DescPBlockProps = {
  outerStyle?: string;
  titleStyle?: string;
  spanStyle: string;
  label: string;
  value: string | number | (string | number)[];
};

const DescPBlock: React.FC<DescPBlockProps> = ({
  outerStyle,
  titleStyle,
  spanStyle,
  label,
  value,
}) => {
  return (
    <div className={`${outerStyle}`}>
      <p
        className={`${titleStyle} text-xs text-gray-600 font-medium uppercase tracking-wide`}
      >
        {label}
      </p>
      <p className="flex flex-wrap gap-1 justify-start items-center">
        {Array.isArray(value) ? (
          (value as string[])
            .sort((a, b) => compare(a, b))
            .map((v, i) => (
              <span key={i} className={`font-medium ${spanStyle} border px-1`}>
                {v}
              </span>
            ))
        ) : (
          <span className={`font-semibold ${spanStyle}`}>{value}</span>
        )}
      </p>
    </div>
  );
};

export default DescPBlock;
