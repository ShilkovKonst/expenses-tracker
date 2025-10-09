import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useState,
} from "react";
import TagButton from "./TagButton";
import { TagType } from "@/types/formTypes";

type ConfirmationBlockProps = {
  title: string;
  confirmClick: () => void;
  setIsModal: Dispatch<SetStateAction<boolean>>;
  inputPlaceholder: string;
  confirmText: string;
  cancelText: string;
  checkBoxTip?: string;
};

const ModalBlock: React.FC<ConfirmationBlockProps> = ({
  title,
  confirmClick,
  setIsModal,
  inputPlaceholder,
  confirmText,
  cancelText,
  checkBoxTip,
}) => {
  const [customTag, setCustomTag] = useState<TagType>({ id: 0, type: "" });
  const handleChange = (custom: string) => {
    setCustomTag({ id: 0, type: custom });
  };

  const handleClick = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const foreground = target.closest("#foreground");
    const cancel = target.closest("#cancel");
    const confirm = target.closest("#confirm");
    const body = target.closest("#body");

    if (confirm) {
      confirmClick();
      setIsModal(false);
      return;
    }
    if (cancel) {
      setIsModal(false);
      return;
    }
    if (body) {
      return;
    }
    if (foreground) {
      setIsModal(false);
      return;
    }
  };

  return (
    <div
      id="foreground"
      onClick={(e) => handleClick(e)}
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        id="body"
        className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4"
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <form className="w-full grid grid-cols-2 gap-3 items-center">
          <input
            id="textInput"
            className="w-full col-span-2 px-2 py-1 border-2 border-blue-100 rounded-md text-sm transition-colors duration-200 bg-white"
            placeholder={inputPlaceholder}
            type="text"
            value={customTag.type}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div
            title={checkBoxTip}
            className=" col-span-3 flex justify-start items-center gap-2"
          >
            <input
              id="checkInput"
              type="checkbox"
              className="col-span-1"
              checked={!!customTag.withBudget}
              onChange={() => {
                setCustomTag({
                  ...customTag,
                  withBudget: !customTag.withBudget,
                });
              }}
            />
            <label htmlFor="checkInput" className="col-span-2">
              {} With buget?
            </label>
          </div>

          <TagButton
            id="confirm"
            title={confirmText}
            style="bg-green-200 hover:bg-green-300 border-green-300 cols-span-1"
            handleClick={() => {}}
          />
          <TagButton
            id="cancel"
            title={cancelText}
            style="bg-red-200 hover:bg-red-300 border-red-300 cols-span-1"
            handleClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
};

export default ModalBlock;
