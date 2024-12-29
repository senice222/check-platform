import React from 'react'
import s from './bottom-bar.module.scss'
import {DocumentIcon, ChecksIcon, ClientIcon, CompanyIcon, SettingsIcon} from '../svgs/svgs'
import { useNavigate } from 'react-router-dom'

const BottomBar = () => {
  const navigate = useNavigate()
  return (
    <div className={s.bottomBar}>
      <div className={s.item} onClick={() => navigate('/admin/applications')}>
        <DocumentIcon />
        <span>Заявки</span>
      </div>
      <div className={s.item} onClick={() => navigate('/admin/checks')}>
        <ChecksIcon />
        <span>Чеки</span>
      </div>
      <div className={s.item} onClick={() => navigate('/admin/clients')}>
        <ClientIcon />
        <span>Клиенты</span>
      </div>
      <div className={s.item} onClick={() => navigate('/admin/companies')}>
        <CompanyIcon />
        <span>Компании</span>
      </div>
      <div className={s.item} onClick={() => navigate('/admin/settings')}>
        <SettingsIcon />
        <span>Настройки</span>
      </div>
    </div>
  )
}

export default BottomBar
