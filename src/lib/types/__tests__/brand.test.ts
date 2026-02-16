import {
  createTrackerId,
  createYearId,
  createMonthId,
  createRecordId,
  createTagId,
} from "../brand";

describe("branded type creators", () => {
  it("createTrackerId returns the value passed in", () => {
    const id = createTrackerId("abc-123");
    expect(id).toBe("abc-123");
  });

  it("createYearId returns the value passed in", () => {
    const id = createYearId(2024);
    expect(id).toBe(2024);
  });

  it("createMonthId returns the value passed in", () => {
    const id = createMonthId(6);
    expect(id).toBe(6);
  });

  it("createRecordId returns the value passed in", () => {
    const id = createRecordId(42);
    expect(id).toBe(42);
  });

  it("createTagId returns the value passed in", () => {
    const id = createTagId(7);
    expect(id).toBe(7);
  });
});
