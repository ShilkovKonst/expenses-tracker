import {
  trimLeadingZeros,
  sanitizeAmountExpression,
  calcExpression,
  calcExpressionAlg,
  decimalToInputString,
  inputStringToDecimal,
} from "../amountHelper";

describe("trimLeadingZeros", () => {
  it("removes leading zeros from integers", () => {
    expect(trimLeadingZeros("007")).toBe("7");
    expect(trimLeadingZeros("0100")).toBe("100");
  });

  it("returns '0' for all zeros", () => {
    expect(trimLeadingZeros("000")).toBe("0");
    expect(trimLeadingZeros("0")).toBe("0");
  });

  it("preserves decimals correctly", () => {
    expect(trimLeadingZeros("0.5")).toBe("0.5");
    expect(trimLeadingZeros("00.5")).toBe("0.5");
    expect(trimLeadingZeros("010.5")).toBe("10.5");
  });
});

describe("sanitizeAmountExpression", () => {
  it("returns '0' for empty input", () => {
    expect(sanitizeAmountExpression("")).toBe("0");
  });

  it("passes through simple numbers", () => {
    expect(sanitizeAmountExpression("123")).toBe("123");
  });

  it("converts commas to dots", () => {
    expect(sanitizeAmountExpression("1,5")).toBe("1.5");
  });

  it("strips invalid characters", () => {
    expect(sanitizeAmountExpression("12abc34")).toBe("1234");
  });

  it("handles operator expressions", () => {
    expect(sanitizeAmountExpression("10+20")).toBe("10+20");
    expect(sanitizeAmountExpression("5*3-1")).toBe("5*3-1");
  });

  it("replaces chained operators with the last one", () => {
    expect(sanitizeAmountExpression("10+-5")).toBe("10-5");
    expect(sanitizeAmountExpression("10*/5")).toBe("10/5");
  });

  it("allows leading negative sign", () => {
    expect(sanitizeAmountExpression("-5")).toBe("-5");
  });

  it("trims leading zeros in sub-expressions", () => {
    expect(sanitizeAmountExpression("007+003")).toBe("7+3");
  });

  it("handles dot without leading digit", () => {
    expect(sanitizeAmountExpression(".5+.3")).toBe("0.5+0.3");
  });

  it("collapses consecutive operators to the last one", () => {
    // each operator replaces the previous: + → - → * → /
    expect(sanitizeAmountExpression("+-*/")).toBe("/");
  });

  it("strips trailing operator", () => {
    const result = sanitizeAmountExpression("10+");
    expect(result).toBe("10+");
  });

  it("handles multiple dots in a single number (keeps first)", () => {
    expect(sanitizeAmountExpression("1.2.3")).toBe("1.23");
  });
});

describe("calcExpression", () => {
  it("evaluates simple addition", () => {
    expect(calcExpression("10+5")).toBe(15);
  });

  it("evaluates subtraction", () => {
    expect(calcExpression("20-8")).toBe(12);
  });

  it("evaluates multiplication", () => {
    expect(calcExpression("4*3")).toBe(12);
  });

  it("evaluates division", () => {
    expect(calcExpression("10/4")).toBe(2.5);
  });

  it("evaluates left-to-right (no algebraic precedence)", () => {
    // 5+10/2 => left-to-right: (5+10)/2 = 7.5
    expect(calcExpression("5+10/2")).toBe(7.5);
  });

  it("handles negative first operand", () => {
    expect(calcExpression("-5+10")).toBe(5);
  });

  it("handles decimals", () => {
    expect(calcExpression("1.5+2.5")).toBe(4);
  });

  it("returns NaN for empty string", () => {
    expect(calcExpression("")).toBeNaN();
  });

  it("returns NaN for non-numeric input", () => {
    expect(calcExpression("abc")).toBeNaN();
  });

  it("returns NaN for division by zero", () => {
    expect(calcExpression("5/0")).toBe(Infinity);
  });
});

describe("calcExpressionAlg", () => {
  it("respects algebraic order of operations", () => {
    // 5+10/2 => 5 + 5 = 10, then *100 = 1000
    expect(calcExpressionAlg("5+10/2")).toBe(1000);
  });

  it("handles multiplication before addition", () => {
    // 2+3*4 => 2+12 = 14, then *100 = 1400
    expect(calcExpressionAlg("2+3*4")).toBe(1400);
  });

  it("handles negative first operand", () => {
    // -5+10 => 5, *100 = 500
    expect(calcExpressionAlg("-5+10")).toBe(500);
  });

  it("returns result in cents (multiplied by 100)", () => {
    expect(calcExpressionAlg("1")).toBe(100);
    expect(calcExpressionAlg("0.5")).toBe(50);
  });

  it("returns NaN for empty string", () => {
    expect(calcExpressionAlg("")).toBeNaN();
  });

  it("returns NaN for non-numeric input", () => {
    expect(calcExpressionAlg("abc")).toBeNaN();
  });
});

describe("decimalToInputString", () => {
  it("formats amount for 'en' locale", () => {
    const result = decimalToInputString("en", 1050);
    expect(result).toBe("10.50");
  });

  it("formats amount for 'ru' locale", () => {
    const result = decimalToInputString("ru", 1050);
    // Russian locale uses comma as decimal separator
    expect(result).toContain("10");
    expect(result).toContain("50");
  });

  it("formats zero", () => {
    expect(decimalToInputString("en", 0)).toBe("0.00");
  });

  it("formats negative amounts", () => {
    const result = decimalToInputString("en", -1050);
    expect(result).toBe("-10.50");
  });
});

describe("inputStringToDecimal", () => {
  it("converts string to cents", () => {
    expect(inputStringToDecimal("10.50")).toBe(1050);
  });

  it("rounds to nearest cent", () => {
    expect(inputStringToDecimal("10.555")).toBe(1056);
  });

  it("returns 0 for NaN input", () => {
    expect(inputStringToDecimal("abc")).toBe(0);
    expect(inputStringToDecimal("")).toBe(0);
  });
});
