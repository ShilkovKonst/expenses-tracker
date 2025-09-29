export type FormType = {
  years: YearFormType[];
  total: number;
};

export type YearFormType = {
  year: number;
  months: Record<MonthIdType, MonthFormType>;
  total: number;
};

export type MonthFormType = {
  title: Months;
  costs: CostFormType[];
  total: number;
};

export type CostFormType = {
  title: string;
  type: string;
  total: number;
};

export type Months =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export type MonthIdType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
