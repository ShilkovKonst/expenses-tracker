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
export type TopLevelButtonProps = {
  icon: ReactNode | string;
  title: string;
  customStyle: string;
  dataType?: string;
  dataUpdate?: string;
  handleClick: (() => void) | ((e: RME<HTMLButtonElement, MouseEvent>) => void);
  disabled?: boolean;
  isExpand?: boolean;
};

export type MidLevelButtonProps = {
  customStyle: string;
  title: string;
  handleClick: () => void;
  content?: ReactNode;
  id?: string;
  disabled?: boolean;
};

export type LowLevelButtonProps = {
  icon: ReactNode;
  value: string;
  handleClick: (value: string) => Promise<void>;
  customStyle?: string;
  disabled?: boolean;
};

export type TagButtonProps = {
  id: number;
  tag: string | number;
  customStyle: string;
  handleClick: (id: number) => void;
  disabled?: boolean;
  dataIndex?: string;
};
