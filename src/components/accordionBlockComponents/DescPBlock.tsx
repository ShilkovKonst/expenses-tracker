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
      <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
        {label}
      </span>
      {Array.isArray(value) ? (
        value.map((v) => (
          <span key={v} className={`font-semibold ${spanStyle}`}>
            {v}
          </span>
        ))
      ) : (
        <span className={`font-semibold ${spanStyle}`}>{value}</span>
      )}
    </div>
  );
};

export default DescPBlock;
