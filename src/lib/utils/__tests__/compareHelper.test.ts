import { describe, it, expect } from "vitest";
import { compare } from "../compareHelper";

describe("compare", () => {
  it("returns negative when first number is smaller", () => {
    expect(compare(1, 2)).toBeLessThan(0);
  });

  it("returns positive when first number is larger", () => {
    expect(compare(2, 1)).toBeGreaterThan(0);
  });

  it("returns 0 for equal numbers", () => {
    expect(compare(1, 1)).toBe(0);
  });

  it("returns negative when first string comes before second (localeCompare)", () => {
    expect(compare("a", "b")).toBeLessThan(0);
  });

  it("returns positive when first string comes after second", () => {
    expect(compare("b", "a")).toBeGreaterThan(0);
  });

  it("returns 0 for equal strings", () => {
    expect(compare("a", "a")).toBe(0);
  });

  it("throws when types mismatch", () => {
    expect(() => compare(1, "a" as unknown as number)).toThrow(
      "types must be the same and either string or number",
    );
  });
});
