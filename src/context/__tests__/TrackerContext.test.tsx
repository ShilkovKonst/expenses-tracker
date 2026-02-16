import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { TrackerProvider, useTracker } from "../TrackerContext";
import { GlobalContext } from "../GlobalContext";
import { Locale } from "@/locales/locale";

// Mock populateTrackerContex
vi.mock("@/lib/utils/updateLocalTrackerIds", () => ({
  populateTrackerContex: vi.fn(),
}));

function TestConsumer() {
  const { trackerId, trackerMeta, trackerTags, trackerYears } = useTracker();
  return (
    <div>
      <span data-testid="tracker-id">{trackerId || "empty"}</span>
      <span data-testid="meta">{trackerMeta ? "set" : "null"}</span>
      <span data-testid="tags">{trackerTags ? "set" : "null"}</span>
      <span data-testid="years">{trackerYears ? "set" : "null"}</span>
    </div>
  );
}

const globalValue = {
  locale: "en" as Locale,
  allTrackersMeta: [],
  setAllTrackersMeta: vi.fn(),
  isLoading: false,
  setIsLoading: vi.fn(),
};

describe("TrackerContext", () => {
  it("renders children", () => {
    render(
      <GlobalContext.Provider value={globalValue}>
        <TrackerProvider>
          <div data-testid="child">hello</div>
        </TrackerProvider>
      </GlobalContext.Provider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("initial state: trackerId is empty, all data is null", () => {
    render(
      <GlobalContext.Provider value={globalValue}>
        <TrackerProvider>
          <TestConsumer />
        </TrackerProvider>
      </GlobalContext.Provider>,
    );

    expect(screen.getByTestId("tracker-id")).toHaveTextContent("empty");
    expect(screen.getByTestId("meta")).toHaveTextContent("null");
    expect(screen.getByTestId("tags")).toHaveTextContent("null");
    expect(screen.getByTestId("years")).toHaveTextContent("null");
  });

  it("useTracker throws outside provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useTracker must be used within a TrackerProvider",
    );
    consoleSpy.mockRestore();
  });
});
