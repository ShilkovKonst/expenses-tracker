import { BasePProps } from "./types";

export const BasePBlock = ({
  outerStyle,
  title,
  titleStyle,
  children,
}: BasePProps) => {
  return (
    <div className={`${outerStyle}`}>
      <p className={`${titleStyle} text-xs uppercase tracking-wide`}>{title}</p>
      <p className="flex flex-wrap justify-start items-center gap-1">
        {children}
      </p>
    </div>
  );
};

export function renderText(text: string, valueStyle = "") {
  return <span className={`${valueStyle}`}>{text}</span>;
}

export function renderTextList(values: string[], valueStyle = "") {
  return values.map((v) => (
    <span key={v} className={`font-medium ${valueStyle} border px-1`}>
      {v}
    </span>
  ));
}

// export function renderDate(
//   value: string,
//   isOutdated?: boolean,
//   valueStyle = ""
// ) {
//   return values.map((v) => (
//     <p key={v} className={`font-medium ${valueStyle} border px-1`}>
//       {v}
//     </p>
//   ));
// }
