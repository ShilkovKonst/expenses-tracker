import { AMOUNT_REGEX, OP_REGEX } from "../constants";

export function regexAmount(amount: string) {
  const processedAmount = amount.replace(",", ".");
  return processedAmount.length === 0
    ? "0"
    : processedAmount.replace(AMOUNT_REGEX, "");
}

export function calcExpression(amount: string) {
  let tokens = [...amount.matchAll(OP_REGEX)].map((t) => t[0]);
  if (!tokens) return NaN;
  /* with respect of algebraic order of operations */
  // const stack: string[] = [];
  // for (let i = 0; i < tokens.length; i++) {
  //   const token = tokens[i];
  //   if (token === "*" || token === "/") {
  //     const prev = stack.pop();
  //     if (i < tokens.length - 1) {
  //       const next = tokens[++i];
  //       if (prev && next) {
  //         const res =
  //           token === "*"
  //             ? Math.round(parseFloat(prev) * parseFloat(next) * 100) / 100
  //             : Math.round((parseFloat(prev) / parseFloat(next)) * 100) / 100;
  //         stack.push(res.toString());
  //       }
  //     }
  //   } else if (/[+\-]/.test(token)) {
  //     stack.push(token);
  //   } else {
  //     stack.push(token);
  //   }
  // }
  // let result = stack[0];
  // for (let i = 1; i < stack.length; i += 2) {
  //   const op = stack[i];
  //   const next = stack[i + 1];
  //   if (op === '+') result += next;
  //   if (op === '-') result -= next;
  // }

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
  return result;
}
