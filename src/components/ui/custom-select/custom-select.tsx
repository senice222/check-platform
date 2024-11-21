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
  type: string;
}
interface SelectProps {
  onChange: (value: CompanyI) => void;
  companies: CompanyI[];
}

const CustomSelect : React.FC<SelectProps> = () => {
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
