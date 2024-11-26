import React from "react";
import Select from "react-select";
import { Company } from "../../../types/company.types";
import s from './custom-select.module.scss';

interface SelectProps {
  onChange: (value: Company) => void;
  companies: Company[];
  defaultValue?: Company;
}

const CustomSelect: React.FC<SelectProps> = ({ companies, defaultValue, onChange }) => {
  const getOptionLabel = (company: Company) => (
    <div className={s.selectItem}>
      <p style={{color: "#14151A", fontSize: "14px", fontWeight: "400"}}>
        {company.name}
      </p>
      {company.type === 'elit' && (
        <div className={`${s.status1} ${s.elit}`}>
          <p>Элитная</p>
        </div>
      )}
    </div>
  );

  const customStyles = {
    option: (styles: any, state: any) => ({
      ...styles,
      backgroundColor: state.isSelected ? "#E4E4E4" : "#fff",
      ":hover": {background: "#efefef"},
      transition: "0.1s",
    }),
    control: (styles: any, state: any) => ({
      ...styles,
      height: "46px",
      outline: "none",
      borderRadius: "12px",
      width: "100%",
      border: state.isFocused ? "1px solid #e4e4e4" : "1px solid #DEE0E3",
      ":hover": {
        border: state.isFocused ? "1px solid #e4e4e4" : "1px solid #DEE0E3",
      },
      boxShadow: "none",
    }),
    input: (styles: any) => ({
      ...styles,
      outline: "none",
      border: "none",
    }),
    container: (styles: any) => ({
      ...styles,
      width: "100%",
      border: "none",
    }),
  };

  return (
    <Select
      onChange={(option) => option && onChange(option.value)}
      defaultValue={defaultValue ? {
        value: defaultValue,
        label: getOptionLabel(defaultValue)
      } : undefined}
      options={companies.map(company => ({
        value: company,
        label: getOptionLabel(company)
      }))}
      styles={customStyles}
    />
  );
};

export default CustomSelect;
