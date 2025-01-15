import React, { useState, useEffect } from 'react'
import s from './input.module.scss'

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
   style?: React.CSSProperties
}

const Input = ({ label, error, value, onChange, placeholder, icon, toggleType, noMargin, disabled, style }: InputProps) => {
   const [inputValue, setInputValue] = useState(value)
   const [inputType, setInputType] = useState('text')

   useEffect(() => {
      setInputValue(value)
   }, [value])

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
      <div className={s.inputGroup} style={noMargin ? {marginBottom: 0, marginTop: '0px'} : {}}>
         {label && <label className={s.label}>{label}</label>}
         <div className={s.inputWrapper}>
            <input
               disabled={disabled}
               type={inputType}
               placeholder={placeholder}
               className={s.input}
               value={inputValue || ''}
               onChange={handleChange}
               style={style}
            />
            {icon && (
               <div className={s.icon} onClick={handleToggleType}>
                  <img src={icon} alt="/" />
               </div>
            )}
         </div>
         {error && <span className={s.errorText}>{error}</span>}
      </div>
   )
}

export default Input

