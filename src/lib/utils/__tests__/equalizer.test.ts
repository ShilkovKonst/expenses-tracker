import { describe, it, expect } from "vitest";
import { isEqual } from "../equalizer";

describe("isEqual", () => {
  describe("primitives", () => {
    it("returns true for same numbers", () => {
      expect(isEqual(1, 1)).toBe(true);
    });

    it("returns false for different numbers", () => {
      expect(isEqual(1, 2)).toBe(false);
    });

    it("returns true for same strings", () => {
      expect(isEqual("a", "a")).toBe(true);
    });

    it("returns false for different strings", () => {
      expect(isEqual("a", "b")).toBe(false);
    });

    it("returns true for same booleans", () => {
      expect(isEqual(true, true)).toBe(true);
    });

    it("returns false for different booleans", () => {
      expect(isEqual(true, false)).toBe(false);
    });
  });

  describe("null and undefined", () => {
    it("returns true for null vs null", () => {
      expect(isEqual(null, null)).toBe(true);
    });

    it("returns false for null vs object", () => {
      expect(isEqual(null, {})).toBe(false);
    });

    it("returns true for undefined vs undefined", () => {
      expect(isEqual(undefined, undefined)).toBe(true);
    });
  });

  describe("arrays", () => {
    it("returns true for equal arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("returns false for different length arrays", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("returns false for arrays with different elements", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("returns true for nested equal arrays", () => {
      expect(isEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
    });
  });

  describe("objects", () => {
    it("returns true for equal objects", () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it("returns false when one has extra key", () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 } as { a: number })).toBe(false);
    });

    it("returns false for different values", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("returns true for nested equal objects", () => {
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    });
  });

  describe("mixed types", () => {
    it("returns false for array vs non-array with different keys", () => {
      expect(isEqual([1, 2] as unknown, { a: 1, b: 2 } as unknown)).toBe(
        false,
      );
    });

    it("returns false for different structures", () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 } as { a: number })).toBe(false);
    });
  });
});
