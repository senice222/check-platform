import React, {FC} from 'react'
import s from './is-editing-bar.module.scss'
import {Attention} from '../svgs/svgs'


interface IsEditingBarProps {
    isEditing: boolean,
    desktop?: boolean
}
const IsEditingBar: FC<IsEditingBarProps> = ({isEditing, desktop}) => {
  return (
    <div className={`${s.editingBar} ${isEditing ? s.active : ''} ${desktop ? s.desktop : ""}`}>
        <Attention />
        <p>Заявка редактируется</p>
    </div>
  )
}

export default IsEditingBar

