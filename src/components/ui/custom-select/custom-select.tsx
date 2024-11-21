import React from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: <div>sadasdasd</div> },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
interface CompanyI {
  name: string;
  inn: string;
  type: "elit" | "standart";
}
interface SelectProps {
  onChange: (name: string) => void;
  companies: CompanyI[];
}

const CustomSelect = () => {
  return (
    <Select
      onChange={(name) => {
        console.log(name);
      }}
      styles={{
        control: (styles) => ({
          ...styles,
          height: "46px",
          borderRadius: "12px",
          width: "100%",
        }),
        container: (styles) => ({ ...styles, width: "100%" }),
      }}
      options={options}
    />
  );
};

export default CustomSelect;
