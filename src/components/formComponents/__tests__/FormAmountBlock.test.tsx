import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormAmountBlock from "../FormAmountBlock";

const defaultProps = {
  name: "amount",
  title: "Amount",
  outerStyle: "",
  styleLabel: "",
  styleInput: "",
  id: "amount-input",
  value: "",
  disabled: false,
  required: true,
  handleChange: vi.fn(),
};

describe("FormAmountBlock", () => {
  it("renders label and input", () => {
    render(<FormAmountBlock {...defaultProps} />);
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("hides label when withoutLabel is true", () => {
    render(<FormAmountBlock {...defaultProps} withoutLabel />);
    expect(screen.queryByText("Amount")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
  });

  it("sanitizes the displayed value", () => {
    render(<FormAmountBlock {...defaultProps} value="00123" />);
    expect(screen.getByRole("textbox")).toHaveValue("123");
  });

  it("calls handleChange on input", async () => {
    const handleChange = vi.fn();
    render(<FormAmountBlock {...defaultProps} handleChange={handleChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "5");
    expect(handleChange).toHaveBeenCalled();
  });

  it("does not show calc button when isCalcMode is false", () => {
    render(<FormAmountBlock {...defaultProps} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows calc button when isCalcMode is true", () => {
    render(
      <FormAmountBlock
        {...defaultProps}
        isCalcMode
        handleCalc={vi.fn()}
        value="5+3"
      />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("=")).toBeInTheDocument();
  });

  it("calls handleCalc with current value on button click", async () => {
    const handleCalc = vi.fn();
    render(
      <FormAmountBlock
        {...defaultProps}
        isCalcMode
        handleCalc={handleCalc}
        value="10+5"
      />
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleCalc).toHaveBeenCalledWith("10+5");
  });

  it("disabled input does not trigger handleChange", async () => {
    const handleChange = vi.fn();
    render(
      <FormAmountBlock {...defaultProps} handleChange={handleChange} disabled />
    );
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "5");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not show calc button when isCalcMode is true but handleCalc is undefined", () => {
    render(<FormAmountBlock {...defaultProps} isCalcMode />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
