import { render, screen, act } from "@testing-library/react";
import { FlashProvider, useFlash } from "../FlashContext";

function TestConsumer() {
  const { flash, addFlash, closeFlash } = useFlash();
  return (
    <div>
      <button onClick={() => addFlash("success", "Test message")}>Add</button>
      <button onClick={() => closeFlash("non-existent-id")}>Close Bogus</button>
      <ul>
        {flash.map((f) => (
          <li key={f.id} data-testid={`flash-${f.id}`}>
            {f.type}: {f.message}
            <button onClick={() => closeFlash(f.id)}>Close</button>
          </li>
        ))}
      </ul>
      <span data-testid="count">{flash.length}</span>
    </div>
  );
}

describe("FlashContext", () => {
  it("provides context values through FlashProvider", () => {
    render(
      <FlashProvider>
        <TestConsumer />
      </FlashProvider>
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("addFlash adds a flash message", async () => {
    render(
      <FlashProvider>
        <TestConsumer />
      </FlashProvider>
    );

    await act(async () => {
      screen.getByText("Add").click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByText(/success: Test message/)).toBeInTheDocument();
  });

  it("closeFlash removes a flash by id", async () => {
    render(
      <FlashProvider>
        <TestConsumer />
      </FlashProvider>
    );

    await act(async () => {
      screen.getByText("Add").click();
    });
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await act(async () => {
      screen.getByText("Close").click();
    });
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("useFlash throws outside FlashProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useFlash must be used within a FlashProvider"
    );
    consoleSpy.mockRestore();
  });

  it("closing a non-existent flash id is a no-op", async () => {
    render(
      <FlashProvider>
        <TestConsumer />
      </FlashProvider>
    );

    await act(async () => {
      screen.getByText("Add").click();
    });
    expect(screen.getByTestId("count")).toHaveTextContent("1");

    await act(async () => {
      screen.getByText("Close Bogus").click();
    });
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("supports adding multiple flashes", async () => {
    render(
      <FlashProvider>
        <TestConsumer />
      </FlashProvider>
    );

    await act(async () => {
      screen.getByText("Add").click();
    });
    await act(async () => {
      screen.getByText("Add").click();
    });
    await act(async () => {
      screen.getByText("Add").click();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(screen.getAllByText(/success: Test message/)).toHaveLength(3);
  });
});
