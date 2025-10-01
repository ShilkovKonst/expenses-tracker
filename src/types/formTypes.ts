export type FormType = {
  years: Record<number, YearFormType>;
  totalCosts: number;
};

export type YearFormType = {
  months: Record<MonthIdType, MonthFormType>;
  yearCosts: number;
  yearBudget: number;
};

export type MonthFormType = {
  title: Months;
  costs: CostFormType[];
  monthCosts: number;
  budget: number;
};

export type CostFormType = {
  title: string;
  type: string;
  amount: number;
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
