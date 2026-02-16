import { describe, it, expect } from "vitest";
import { t } from "../locale";

describe("t (translation function)", () => {
  it("returns English string for en locale", () => {
    expect(t("en", "meta.titleFull")).toBe(
      "SpendObserver - expense tracker",
    );
  });

  it("returns Russian string for ru locale", () => {
    expect(t("ru", "meta.titleFull")).toBe(
      "SpendObserver - трекер расходов",
    );
  });

  it("interpolates variables with {{varName}}", () => {
    const result = t("en", "body.flash.newTrackerAdded", {
      trackerId: "my-tracker",
    });
    expect(result).toBe("New tracker my-tracker is registered");
  });

  it("replaces multiple variables", () => {
    const result = t("en", "body.modal.descDelete", {
      deleteEntity: "record",
      deleteEntityId: "42",
    });
    expect(result).toBe("record '42' will be completely removed!");
  });

  it("throws on invalid path", () => {
    expect(() => t("en", "does.not.exist")).toThrow("Invalid translation path");
  });

  it("throws when leaf is not a string", () => {
    expect(() => t("en", "body")).toThrow('is not a string');
  });
});
