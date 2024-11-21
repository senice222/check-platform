import React, {FC} from 'react'
import s from './is-editing-bar.module.scss'
import {Attention} from '../svgs/svgs'


interface IsEditingBarProps {
    isEditing: boolean
}
const IsEditingBar: FC<IsEditingBarProps> = ({isEditing}) => {
  return (
    <div className={`${s.editingBar} ${isEditing ? s.active : ''}`}>
        <Attention />
        <p>Заявка редактируется</p>
    </div>
  )
}

export default IsEditingBar

