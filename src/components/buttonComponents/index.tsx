import { memo } from "react";
import {
  BaseButtonProps,
  IconButtonProps,
  UtilButtonProps,
  SubmitButtonProps,
  ValidateButtonProps,
  TextRoundedButtonProps,
  LowLevelButtonProps,
} from "./types";
import { createTagId } from "@/lib/types/dataTypes";

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
      type="submit"
      title={title}
      className={`${customStyle} p-1 rounded`}
      disabled={disabled}
    >
      {icon}
    </BaseButton>
  );
});

export const UtilButton = memo(function UtilButton({
  icon,
  title,
  customStyle,
  dataType,
  dataUpdate,
  handleClick,
  disabled,
}: UtilButtonProps) {
  return (
    <BaseButton
      type="button"
      title={title}
      onClick={handleClick}
      className={`${customStyle} p-1 rounded`}
      disabled={disabled}
      data-type={dataType}
      data-update={dataUpdate}
    >
      {icon}
    </BaseButton>
  );
});

export const ValidateButton = memo(function ValidateButton({
  customStyle,
  title,
  content = title,
  id,
  handleClick,
  disabled,
}: ValidateButtonProps) {
  return (
    <BaseButton
      type="button"
      title={title}
      id={id ?? ""}
      className={`${customStyle} my-1 px-2 py-1 rounded text-sm font-bold border-2`}
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

export const IconButton = memo(function IconButton({
  icon,
  value,
  title,
  handleClick,
  customStyle,
  disabled,
}: IconButtonProps) {
  return (
    <BaseButton
      type="button"
      title={title}
      className={`${customStyle}`}
      onClick={() => handleClick(value)}
      disabled={disabled}
    >
      {icon}
    </BaseButton>
  );
});

export const TextRoundedButton = memo(function TextRoundedButton({
  id,
  value,
  title,
  customStyle,
  handleClick,
  disabled,
  dataIndex,
}: TextRoundedButtonProps) {
  return (
    <BaseButton
      type="button"
      title={title}
      onClick={() => (handleClick && id ? handleClick(createTagId(id)) : {})}
      className={`tag ${customStyle} my-auto px-2 h-5 text-xs text-center font-semibold rounded-lg`}
      disabled={disabled}
      data-index={dataIndex}
    >
      {value}
    </BaseButton>
  );
});
