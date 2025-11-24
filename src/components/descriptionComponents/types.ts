import { ReactNode } from "react";

export type DescH3Props = {
  label: string | number;
  totalRecords?: number;
};

export type BasePProps = {
  title: string;
  outerStyle?: string;
  titleStyle?: string;
  children: ReactNode;
};

export type DescPProps = {
  title: string;
  value: string | string[];
  outerStyle?: string;
  titleStyle?: string;
  valueStyle?: string;
};

export type DescDateProps = {
  title: string;
  value: ReactNode;
  isOutdated?: boolean;
  outerStyle?: string;
  titleStyle?: string;
  valueStyle?: string;
};
