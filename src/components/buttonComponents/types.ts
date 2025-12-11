import { TagId } from "@/lib/types/brand";
import { ButtonHTMLAttributes, MouseEvent as RME, ReactNode } from "react";

export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className: string;
};

export type SubmitButtonProps = {
  icon: ReactNode;
  title: string;
  customStyle: string;
  disabled?: boolean;
};
export type UtilButtonProps = {
  icon: ReactNode | string;
  title: string;
  customStyle: string;
  dataType?: string;
  dataUpdate?: string;
  handleClick: (() => void) | ((e: RME<HTMLButtonElement, MouseEvent>) => void);
  disabled?: boolean;
  isExpand?: boolean;
};

export type ValidateButtonProps = {
  customStyle: string;
  title: string;
  handleClick: () => void;
  content?: ReactNode;
  id?: string;
  disabled?: boolean;
};

export type LowLevelButtonProps = {
  icon: ReactNode;
  value: string | number;
  handleClick: (value: string | number) => Promise<void>;
  customStyle?: string;
  disabled?: boolean;
};

export type IconButtonProps = {
  icon: ReactNode;
  value: string;
  title: string;
  handleClick:
    | ((value: string) => Promise<void>)
    | ((value: string) => Promise<void>)
    | (() => void);
  customStyle?: string;
  disabled?: boolean;
};

export type TextRoundedButtonProps = {
  id: number;
  value: string | number;
  title: string;
  customStyle: string;
  handleClick?: (id: TagId) => void;
  disabled?: boolean;
  dataIndex?: string;
};
