import { Locale } from "@/locales/locale";
import { OP_REGEX } from "../../constants";

export function trimLeadingZeros(num: string): string {
  if (/^0+$/.test(num)) {
    return "0";
  }

  return /\./.test(num)
    ? /^0+\./.test(num)
      ? num.replace(/^0+/, "0")
      : num.replace(/^0+/, "")
    : num.replace(/^0+/, "");
}

export function sanitizeAmountExpression(raw: string): string {
  if (!raw) return "0";

  const s = raw.replace(",", ".").replace(/[^\d.+\-*/]/g, "");

  let result = "";
  let currentNum = "";
  let hasDot = false;

  const flushNumber = () => {
    if (currentNum.length > 0) {
      currentNum = trimLeadingZeros(currentNum);
      result += currentNum;
      currentNum = "";
      hasDot = false;
    }
  };

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (/\d/.test(ch)) {
      currentNum += ch;
      continue;
    }

    if (ch === ".") {
      if (hasDot) continue;

      if (currentNum.length === 0) currentNum = "0";
      currentNum += ".";
      hasDot = true;
      continue;
    }

    if (/[+\-*/]/.test(ch)) {
      flushNumber();

      if (result.length === 0 && ch === "-") {
        result = "-";
        continue;
      }

      const last = result[result.length - 1];
      if (/[+\-*/]/.test(last)) {
        result = result.slice(0, -1) + ch;
      } else {
        result += ch;
      }
      continue;
    }
  }

  flushNumber();
  return result;
}

export function calcExpression(amount: string) {
  let tokens = [...amount.matchAll(OP_REGEX)].map((t) => t[0]);
  if (!tokens) return NaN;

  /* operations executes strictly from left to right, no algebraic order of operations */
  if (tokens[0] === "-" && !isNaN(parseFloat(tokens[1]))) {
    tokens = [tokens[0] + tokens[1], ...tokens.slice(2)];
  }
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = tokens[i + 1];
    if (op === "+") result += parseFloat(next);
    if (op === "-") result -= parseFloat(next);
    if (op === "*") result *= parseFloat(next);
    if (op === "/") result /= parseFloat(next);
  }
  return Math.round(result * 100) / 100;
}

export function calcExpressionAlg(amount: string) {
  let tokens = [...amount.matchAll(OP_REGEX)].map((t) => t[0]);
  if (tokens[0] === "-" && !isNaN(parseFloat(tokens[1]))) {
    tokens = [tokens[0] + tokens[1], ...tokens.slice(2)];
  }
  if (!tokens || isNaN(parseFloat(tokens[0]))) return NaN;
  /* with respect of algebraic order of operations */
  const stack: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "*" || token === "/") {
      const prev = stack.pop();
      if (i < tokens.length - 1) {
        const next = tokens[++i];
        if (prev && next) {
          const res =
            token === "*"
              ? Math.round(parseFloat(prev) * parseFloat(next) * 100) / 100
              : Math.round((parseFloat(prev) / parseFloat(next)) * 100) / 100;
          stack.push(res.toString());
        }
      }
    } else if (/[+\-]/.test(token)) {
      stack.push(token);
    } else {
      stack.push(token);
    }
  }
  let result = parseFloat(stack[0]);
  for (let i = 1; i < stack.length; i += 2) {
    const op = stack[i];
    const next = stack[i + 1];
    if (op === "+") result += parseFloat(next);
    if (op === "-") result -= parseFloat(next);
  }
  return Math.round(result * 100);
}

export function decimalToInputString(locale: Locale, amount: number): string {
  return (amount / 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
  });
}

export function inputStringToDecimal(value: string): number {
  const num = Number.parseInt(value);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}
