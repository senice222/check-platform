import React, { useState } from 'react'
import style from './input.module.scss'

interface InputProps {
   label?: string
   placeholder?: string
   error?: string
   value?: string
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
   icon?: any;
   disabled?: boolean
   toggleType?: boolean
   noMargin?: boolean
}

const Input = ({ label, error, value, onChange, placeholder, icon, toggleType, noMargin, disabled }: InputProps) => {
   const [inputValue, setInputValue] = useState(value)
   const [inputType, setInputType] = useState('text')
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      onChange && onChange(e)
   }

   const handleToggleType = () => {
      if (toggleType) {
         setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'))
      }
   }

   return (
      <div className={style.inputGroup} style={noMargin ? {marginBottom: 0, marginTop: '0px'} : {}}>
         {label && <label className={style.label}>{label}</label>}
         <div className={style.inputWrapper}>
            <input
            disabled={disabled}
               type={inputType}
               placeholder={placeholder}
               className={style.input}
               value={disabled ? value : inputValue}
               onChange={handleChange}
            />
            {icon && (
               <div className={style.icon} onClick={handleToggleType}>
                  <img src={icon} alt="/" />
               </div>
            )}
         </div>
         {error && <div className="input-error">{error}</div>}
      </div>
   )
}

export default Input

