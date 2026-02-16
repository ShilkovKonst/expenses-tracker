import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FormRadioBlock from "../FormRadioBlock";
import { GlobalContext } from "@/context/GlobalContext";
import { Locale } from "@/locales/locale";

const globalValue = {
  locale: "en" as Locale,
  allTrackersMeta: [],
  setAllTrackersMeta: vi.fn(),
  isLoading: false,
  setIsLoading: vi.fn(),
};

const defaultProps = {
  labelRadio: "Type",
  name: "type",
  outerStyle: "",
  styleLabel: "",
  styleInput: "",
  id: "test-radio",
  value: "cost",
  handleChange: vi.fn(),
};

function renderRadio(props = {}) {
  return render(
    <GlobalContext.Provider value={globalValue}>
      <FormRadioBlock {...defaultProps} {...props} />
    </GlobalContext.Provider>,
  );
}

describe("FormRadioBlock", () => {
  beforeEach(() => {
    defaultProps.handleChange.mockClear();
  });

  it("renders two radio options (income, cost)", () => {
    renderRadio();
    expect(screen.getByLabelText("income")).toBeInTheDocument();
    expect(screen.getByLabelText("cost")).toBeInTheDocument();
  });

  it("shows correct checked state based on value prop", () => {
    renderRadio({ value: "cost" });
    expect(screen.getByLabelText("cost")).toBeChecked();
    expect(screen.getByLabelText("income")).not.toBeChecked();
  });

  it("clicking a different option calls handleChange with new value", async () => {
    const user = userEvent.setup();
    renderRadio({ value: "cost" });

    // Click the income radio input directly
    await user.click(screen.getByLabelText("income"));

    expect(defaultProps.handleChange).toHaveBeenCalled();
    expect(defaultProps.handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "type", value: "income" }),
      }),
    );
  });

  it("clicking already-selected option does NOT call handleChange", async () => {
    const user = userEvent.setup();
    renderRadio({ value: "cost" });

    await user.click(screen.getByText("cost"));

    expect(defaultProps.handleChange).not.toHaveBeenCalled();
  });
});
