import { getMonthById, initEmptyMonths, getMonthDays } from "../monthHelper";

describe("getMonthById", () => {
  it("returns correct month names", () => {
    expect(getMonthById(1)).toBe("january");
    expect(getMonthById(6)).toBe("june");
    expect(getMonthById(12)).toBe("december");
  });

  it("returns undefined for out-of-range id", () => {
    expect(getMonthById(0 as never)).toBeUndefined();
    expect(getMonthById(13 as never)).toBeUndefined();
    expect(getMonthById(-1 as never)).toBeUndefined();
  });
});

describe("initEmptyMonths", () => {
  it("returns 12 months", () => {
    const months = initEmptyMonths();
    expect(Object.keys(months)).toHaveLength(12);
  });

  it("each month has empty records and 0 totalAmount", () => {
    const months = initEmptyMonths();
    for (const month of Object.values(months)) {
      expect(month.records).toEqual([]);
      expect(month.totalAmount).toBe(0);
    }
  });

  it("months have correct titles", () => {
    const months = initEmptyMonths();
    expect(months[1].title).toBe("january");
    expect(months[12].title).toBe("december");
  });
});

describe("getMonthDays", () => {
  it("returns 31 days for January", () => {
    expect(getMonthDays(2024, 1)).toHaveLength(31);
  });

  it("returns 28 days for February in a non-leap year", () => {
    expect(getMonthDays(2023, 2)).toHaveLength(28);
  });

  it("returns 29 days for February in a leap year", () => {
    expect(getMonthDays(2024, 2)).toHaveLength(29);
  });

  it("returns 30 days for April", () => {
    expect(getMonthDays(2024, 4)).toHaveLength(30);
  });

  it("returns sequential day numbers starting at 1", () => {
    const days = getMonthDays(2024, 1);
    expect(days[0]).toBe(1);
    expect(days[days.length - 1]).toBe(31);
  });

  it("returns 0 days for month 0", () => {
    // new Date(2024, 0, 0).getDate() gives last day of previous month's December
    const days = getMonthDays(2024, 0);
    expect(days).toHaveLength(31); // wraps to December of previous year
  });

  it("returns days for month 13 (wraps to next year January)", () => {
    const days = getMonthDays(2024, 13);
    expect(days).toHaveLength(31); // wraps to January 2025
  });
});
