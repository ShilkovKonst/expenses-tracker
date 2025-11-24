import { memo } from "react";
import {
  BaseButtonProps,
  LowLevelButtonProps,
  MidLevelButtonProps,
  SubmitButtonProps,
  TagButtonProps,
  TopLevelButtonProps,
} from "./types";

const BaseButton = ({
  children,
  className = "",
  ...props
}: BaseButtonProps) => {
  return (
    <button
      className={`${className} flex justify-center items-center transition-colors duration-200 ease-in-out cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SubmitButton = memo(function SubmitButton({
  icon,
  title,
  customStyle,
  disabled,
}: SubmitButtonProps) {
  return (
    <BaseButton
      title={title}
      type="submit"
      className={`${customStyle} p-1 rounded`}
      disabled={disabled}
    >
      {icon}
    </BaseButton>
  );
});

export const TopLevelButton = memo(function TopLevelButton({
  icon,
  title,
  customStyle,
  dataType,
  dataUpdate,
  handleClick,
  disabled,
}: TopLevelButtonProps) {
  return (
    <BaseButton
      title={title}
      data-type={dataType}
      data-update={dataUpdate}
      type="button"
      onClick={handleClick}
      className={`${customStyle} p-1 rounded`}
      disabled={disabled}
    >
      {icon}
    </BaseButton>
  );
});

export const MidLevelButton = memo(function MidLevelButton({
  customStyle,
  title,
  content = title,
  id,
  handleClick,
  disabled,
}: MidLevelButtonProps) {
  return (
    <BaseButton
      title={title}
      type="button"
      id={id ?? ""}
      className={`${customStyle} px-2 py-1 rounded text-sm font-bold border-2`}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </BaseButton>
  );
});

export const LowLevelButton = memo(function LowLevelButton({
  icon,
  value,
  handleClick,
  customStyle,
  disabled,
}: LowLevelButtonProps) {
  return (
    <BaseButton
      type="button"
      className={`${customStyle} mr-auto bg-green-400 hover:bg-green-500 disabled:bg-green-300 disabled:hover:bg-green-300 disabled:text-gray-600`}
      onClick={() => handleClick(value)}
      disabled={disabled}
    >
      {icon}
    </BaseButton>
  );
});

export const TagButton = memo(function TagButton({
  id,
  tag,
  customStyle,
  handleClick,
  disabled,
  dataIndex,
}: TagButtonProps) {
  
  return (
    <BaseButton
      type="button"
      onClick={() => handleClick(id)}
      className={`tag ${customStyle} my-auto px-2 h-5 text-xs text-center font-semibold rounded-lg`}
      disabled={disabled}
      data-index={dataIndex}
    >
      {tag}
    </BaseButton>
  );
});
