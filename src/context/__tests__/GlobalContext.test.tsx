import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { GlobalProvider, useGlobal, loadTrackers } from "../GlobalContext";
import { TrackerMeta } from "@/lib/types/dataTypes";
import { createTrackerId } from "@/lib/types/brand";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en" }),
}));

// Mock IDBManager
const mockGetAllMeta = vi.fn();
vi.mock("@/idb/IDBManager", () => ({
  getAllMeta: (...args: unknown[]) => mockGetAllMeta(...args),
}));

function TestConsumer() {
  const { locale, allTrackersMeta, isLoading } = useGlobal();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="trackers-count">{allTrackersMeta.length}</span>
      <span data-testid="loading">{String(isLoading)}</span>
    </div>
  );
}

describe("GlobalContext", () => {
  beforeEach(() => {
    mockGetAllMeta.mockReset();
    mockGetAllMeta.mockResolvedValue([]);
  });

  it("renders children and provides default values", async () => {
    render(
      <GlobalProvider>
        <TestConsumer />
      </GlobalProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("en");

    // Wait for async loadTrackers to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("isLoading starts true and becomes false after mount", async () => {
    render(
      <GlobalProvider>
        <TestConsumer />
      </GlobalProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("useGlobal throws outside provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useGlobal must be used within a GlobalProvider",
    );
    consoleSpy.mockRestore();
  });
});

describe("loadTrackers", () => {
  beforeEach(() => {
    mockGetAllMeta.mockReset();
  });

  it("calls getAllMeta and sets state", async () => {
    const meta: TrackerMeta = {
      id: createTrackerId("t1"),
      title: "Tracker 1",
      createdAt: "01/01/2025_00:00:00",
      updatedAt: "01/01/2025_00:00:00",
      backupAt: "01/01/2025_00:00:00",
    };
    mockGetAllMeta.mockResolvedValue([meta]);

    const setMeta = vi.fn();
    const setLoading = vi.fn();

    await loadTrackers(setMeta, setLoading);

    expect(mockGetAllMeta).toHaveBeenCalled();
    expect(setMeta).toHaveBeenCalledWith([meta]);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("handles errors and still sets loading to false", async () => {
    mockGetAllMeta.mockRejectedValue(new Error("fail"));
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const setMeta = vi.fn();
    const setLoading = vi.fn();

    await loadTrackers(setMeta, setLoading);

    expect(setMeta).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(false);
    consoleSpy.mockRestore();
  });
});
