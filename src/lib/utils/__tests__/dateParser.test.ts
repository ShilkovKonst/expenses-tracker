import { formatDatetoMeta, parseMetaToDate, buildFileName } from "../dateParser";

describe("formatDatetoMeta", () => {
  it("formats a known date correctly", () => {
    const date = new Date(2024, 0, 5, 14, 30, 45); // Jan 5, 2024 14:30:45
    expect(formatDatetoMeta(date)).toBe("05/01/2024_14:30:45");
  });

  it("pads single-digit values", () => {
    const date = new Date(2024, 2, 3, 1, 2, 3); // Mar 3, 2024 01:02:03
    expect(formatDatetoMeta(date)).toBe("03/03/2024_01:02:03");
  });
});

describe("parseMetaToDate", () => {
  it("round-trips with formatDatetoMeta", () => {
    const original = new Date(2024, 5, 15, 10, 20, 30);
    const meta = formatDatetoMeta(original);
    const parsed = parseMetaToDate(meta);
    expect(parsed?.getTime()).toBe(original.getTime());
  });

  it("returns undefined for undefined input", () => {
    expect(parseMetaToDate(undefined)).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(parseMetaToDate("")).toBeUndefined();
  });

  it("throws for invalid format", () => {
    expect(() => parseMetaToDate("invalid")).toThrow("Invalid meta date format");
  });
});

describe("buildFileName", () => {
  it("uses dataId as prefix when provided", () => {
    const fileName = buildFileName("myTracker");
    expect(fileName).toMatch(/^myTracker_\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}:\d{2}\.json$/);
  });

  it("uses 'tracker' as prefix when dataId is undefined", () => {
    const fileName = buildFileName(undefined);
    expect(fileName).toMatch(/^tracker_\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}:\d{2}\.json$/);
  });
});
