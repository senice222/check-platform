import React, {FC} from 'react'
import s from './check-box.module.scss'
import {Tick} from '../../svgs/svgs'

interface CheckBoxI {
    setChecked?: () => void
    isChecked: boolean
}

const CheckBox : FC<CheckBoxI> = ({setChecked, isChecked}) => {
  return (
    <div onClick={setChecked} className={`${s.checkbox} ${isChecked ? s.checked : ''}`}>
      <div className={`${s.tick} ${isChecked ? s.active : ''}`}>
        <Tick />
      </div>
    </div>
  )
}

export default CheckBox
