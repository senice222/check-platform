import React from "react";
import Select from "react-select";
import s from './custom-select.module.scss'


interface CompanyI {
  name: string;
  inn: string;
  type: string;
}
interface SelectProps {
  onChange: (value: CompanyI) => void;
  companies: CompanyI[];
  defaultValue?: CompanyI;
}

const CustomSelect: React.FC<SelectProps> = ({ companies, defaultValue }) => {
  const options = companies.map((company) => ({
    value: company.inn, label: <div className={s.selectItem}>
      <p>{company.name}</p>
      {company.type === 'elit' && <div className={`${s.status1} ${s.elit}`}>
        <p>Элитная</p>
      </div>}
    </div>
  }))
  return (
    <Select
      onChange={(name) => {
        console.log(name);
      }}
      defaultValue={{
        value: defaultValue?.inn, label: <div className={s.selectItem}>
          <p style={{color: "#14151A", fontSize: "14px", fontWeight: "400"}}>{defaultValue?.name}</p>
          {defaultValue?.type === 'elit' && <div className={`${s.status1} ${s.elit}`}>
            <p>Элитная</p>
          </div>}
        </div>
      }}
      styles={{
        option: (styles, state) => ({
          ...styles,
          backgroundColor: state.isSelected ? "#E4E4E4" : "#fff",
          ":hover": {background: "#efefef"},
          "transition": "0.1s",
        }),
        control: (styles, state) => ({
          ...styles,
          height: "46px",
          outline: "none",
          borderRadius: "12px",
          width: "100%",
          border: state.isFocused ? "1px solid #e4e4e4" : "1px solid #DEE0E3", // Цвет обводки при фокусе
          ":hover": {
            border: state.isFocused ? "1px solid #e4e4e4" : "1px solid #DEE0E3", // Цвет при наведении, когда фокус активен
          },
          boxShadow: state.isFocused ? "none" : "none", // Подсвечивание при фокусе
        }),
        input: (styles) => ({
          ...styles,
          outline: "none",
          border: "none",
          ":focus": {
            border: "none",
          },
        }),
        container: (styles) => ({
          ...styles,
          width: "100%",
          border: "none",
        }),
      }}
      
      options={options}
    />
  );
};

export default CustomSelect;
