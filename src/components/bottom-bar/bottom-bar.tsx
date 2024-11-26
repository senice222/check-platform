import React from 'react'
import s from './bottom-bar.module.scss'
import {DocumentIcon, ChecksIcon, ClientIcon, CompanyIcon, SettingsIcon} from '../svgs/svgs'

const BottomBar = () => {
  return (
    <div className={s.bottomBar}>
      <div className={s.item}>
        <DocumentIcon />
        <span>Заявки</span>
      </div>
      <div className={s.item}>
        <ChecksIcon />
        <span>Чеки</span>
      </div>
      <div className={s.item}>
        <ClientIcon />
        <span>Клиенты</span>
      </div>
      <div className={s.item}>
        <CompanyIcon />
        <span>Компании</span>
      </div>
      <div className={s.item}>
        <SettingsIcon />
        <span>Настройки</span>
      </div>
    </div>
  )
}

export default BottomBar
