import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../parseErrorMessage";

describe("getErrorMessage", () => {
  it("returns .message from Error instance", () => {
    expect(getErrorMessage(new Error("boom"), "default")).toBe("boom");
  });

  it("returns string directly", () => {
    expect(getErrorMessage("something went wrong", "default")).toBe(
      "something went wrong",
    );
  });

  it("returns stringified .message from object with message property", () => {
    expect(getErrorMessage({ message: "obj error" }, "default")).toBe(
      "obj error",
    );
  });

  it("returns default for null", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("returns default for undefined", () => {
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
  });

  it("returns default for number", () => {
    expect(getErrorMessage(42, "fallback")).toBe("fallback");
  });
});
