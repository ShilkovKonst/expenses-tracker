"use client";

type DescPBlockProps = {
  outerStyle?: string;
  spanStyle: string;
  label: string;
  value: string | number | (string | number)[];
};

const DescPBlock: React.FC<DescPBlockProps> = ({
  outerStyle,
  spanStyle,
  label,
  value,
}) => {
  return (
    <div className={`${outerStyle} flex flex-col justify-center`}>
      <span className="text-xs text-gray-600 font-medium uppercase tracking-wide ">
        {label}
      </span>
      <div className="flex flex-wrap gap-1 justify-start items-center">
        {Array.isArray(value) ? (
          value.map((v) => (
            <span key={v} className={`font-medium ${spanStyle} border px-1`}>
              {v}
            </span>
          ))
        ) : (
          <span className={`font-semibold ${spanStyle}`}>{value}</span>
        )}
      </div>
    </div>
  );
};

export default DescPBlock;
