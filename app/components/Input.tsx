import React, { FC } from "react";

type InputComponentProps = {
  label: string; // Label text for the input
  id: string; // Input field ID
  placeholder?: string; // Optional placeholder text
  value?: string | number;
  type?: string; // Current value of the input field
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string; // Function to handle value changes
};

const InputComponent: FC<InputComponentProps> = ({
  label,
  id,
  placeholder = "",
  value,
  type = "text",
  onChange,
  defaultValue,
}) => {
  return (
    <div className="flex flex-col ">
      <label htmlFor={id} className="text-xl font-medium">
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        type={type}
        className="px-4 py-2 outline-none border-b-2 border-black"
        onChange={onChange}
        defaultValue={defaultValue} // Calling the passed function when the input value changes
      />
    </div>
  );
};

export default InputComponent;
