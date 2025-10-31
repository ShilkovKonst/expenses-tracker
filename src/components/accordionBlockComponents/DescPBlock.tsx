"use client";

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
    <div className={`${outerStyle} flex gap-2 justify-start items-center`}>
      <p
        className={`${titleStyle} text-xs text-gray-600 font-medium uppercase tracking-wide`}
      >
        {label}
      </p>
      <p className="flex flex-wrap gap-1 justify-start items-center">
        {Array.isArray(value) ? (
          value.sort().map((v) => (
            <span key={v} className={`font-medium ${spanStyle} border px-1`}>
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
