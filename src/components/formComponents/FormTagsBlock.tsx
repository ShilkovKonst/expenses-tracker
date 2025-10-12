import { ChangeEvent } from "react";

type FormTagsProps = {
  name: string;
  title: string;
  styleLabel: string;
  styleInput: string;
  id: string;
  value: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormTagsBlock: React.FC<FormTagsProps> = ({}) => {
  return <div>FormTagsBlock</div>;
};

export default FormTagsBlock;
