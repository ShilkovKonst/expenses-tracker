import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FormSelectBlock from "../FormSelectBlock";
import { GlobalContext } from "@/context/GlobalContext";
import { Locale } from "@/locales/locale";

const globalValue = {
  locale: "en" as Locale,
  allTrackersMeta: [],
  setAllTrackersMeta: vi.fn(),
  isLoading: false,
  setIsLoading: vi.fn(),
};

const onChange = vi.fn();

const defaultProps = {
  id: "day-select",
  outerStyle: "",
  titleStyle: "",
  style: "",
  label: "Day",
  name: "day",
  value: -1,
  options: [1, 2, 3, 15, 28],
  onChange,
};

function renderSelect(props = {}) {
  return render(
    <GlobalContext.Provider value={globalValue}>
      <FormSelectBlock {...defaultProps} {...props} />
    </GlobalContext.Provider>,
  );
}

describe("FormSelectBlock", () => {
  beforeEach(() => {
    onChange.mockClear();
  });

  it("renders select with options", () => {
    renderSelect();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // Placeholder + 5 options
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(6);
  });

  it("default placeholder option shown", () => {
    renderSelect();
    const placeholder = screen.getByText("Select a date (optional)");
    expect(placeholder).toBeInTheDocument();
  });

  it("selecting an option calls onChange", async () => {
    const user = userEvent.setup();
    renderSelect();

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "15");

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("value of -1 applies gray styling class", () => {
    renderSelect({ value: -1 });
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("text-gray-600");
  });

  it("value other than -1 does not apply gray styling class", () => {
    renderSelect({ value: 15 });
    const select = screen.getByRole("combobox");
    expect(select.className).not.toContain("text-gray-600");
  });
});
