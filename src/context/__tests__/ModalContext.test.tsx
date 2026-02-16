import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { ModalProvider, useModal } from "../ModalContext";
import { MonthRecord } from "@/lib/types/dataTypes";
import { createRecordId, createYearId, createMonthId } from "@/lib/types/brand";

// Mock ModalRoot to avoid circular dependency with useModal
vi.mock("@/components/modals/ModalRoot", () => ({
  __esModule: true,
  default: () => <div data-testid="modal-root" />,
}));

const mockRecord: MonthRecord = {
  id: createRecordId(1),
  year: createYearId(2025),
  month: createMonthId(1),
  day: 15,
  type: "cost",
  tags: [],
  description: "test",
  amount: 1000,
};

function TestConsumer() {
  const { modal, openModal, closeModal } = useModal();
  return (
    <div>
      <span data-testid="modal-state">{modal ? modal.type : "null"}</span>
      <button
        onClick={() =>
          openModal("record", {
            record: mockRecord,
            onConfirm: async () => {},
          })
        }
      >
        Open
      </button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

describe("ModalContext", () => {
  it("renders children", () => {
    render(
      <ModalProvider>
        <div data-testid="child">hello</div>
      </ModalProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("hello");
  });

  it("openModal sets modal state with type and props", async () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>,
    );

    expect(screen.getByTestId("modal-state")).toHaveTextContent("null");

    await act(async () => {
      screen.getByText("Open").click();
    });

    expect(screen.getByTestId("modal-state")).toHaveTextContent("record");
  });

  it("closeModal clears modal to null", async () => {
    render(
      <ModalProvider>
        <TestConsumer />
      </ModalProvider>,
    );

    await act(async () => {
      screen.getByText("Open").click();
    });
    expect(screen.getByTestId("modal-state")).toHaveTextContent("record");

    await act(async () => {
      screen.getByText("Close").click();
    });
    expect(screen.getByTestId("modal-state")).toHaveTextContent("null");
  });

  it("useModal throws outside provider", () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useModal must be used within a ModalProvider",
    );
    consoleSpy.mockRestore();
  });
});
