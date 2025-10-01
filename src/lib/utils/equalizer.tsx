import {
  CostFormType,
  FormType,
  MonthFormType,
  MonthIdType,
  YearFormType,
} from "@/types/formTypes";

export function deepEqualFormData(a: FormType, b: FormType): boolean {
  if (a.totalCosts !== b.totalCosts) return false;

  const yearsA = Object.keys(a.years);
  const yearsB = Object.keys(b.years);
  if (yearsA.length !== yearsB.length) return false;

  for (const year of yearsA) {
    if (!(year in b.years)) return false;
    if (!deepEqualYear(a.years[+year], b.years[+year])) return false;
  }

  return true;
}

function deepEqualYear(a: YearFormType, b: YearFormType): boolean {
  if (a.yearCosts !== b.yearCosts) return false;
  if (a.yearBudget !== b.yearBudget) return false;

  const monthsA = Object.keys(a.months);
  const monthsB = Object.keys(b.months);
  if (monthsA.length !== monthsB.length) return false;

  for (const month of monthsA) {
    if (!(month in b.months)) return false;
    if (
      !deepEqualMonth(
        a.months[+month as MonthIdType],
        b.months[+month as MonthIdType]
      )
    )
      return false;
  }

  return true;
}

function deepEqualMonth(a: MonthFormType, b: MonthFormType): boolean {
  if (a.monthCosts !== b.monthCosts) return false;
  if (a.budget !== b.budget) return false;

  if (a.costs.length !== b.costs.length) return false;

  for (let i = 0; i < a.costs.length; i++) {
    if (!deepEqualCost(a.costs[i], b.costs[i])) return false;
  }

  return true;
}

function deepEqualCost(a: CostFormType, b: CostFormType): boolean {
  return a.title === b.title && a.type === b.type && a.amount === b.amount;
}
