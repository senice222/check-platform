import React from 'react'
import s from './bottom-bar.module.scss'
import {DocumentIcon, ChecksIcon, ClientIcon, CompanyIcon, SettingsIcon} from '../svgs/svgs'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectActiveApplicationsCount } from '../../store/slices/applicationSlice';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeApplicationsCount = useSelector(selectActiveApplicationsCount);

  const menuItems = [
    {
      path: '/admin/applications',
      icon: <DocumentIcon />,
      label: 'Заявки',
      badge: activeApplicationsCount
    },
    {
      path: '/admin/checks',
      icon: <ChecksIcon />,
      label: 'Чеки'
    },
    {
      path: '/admin/clients',
      icon: <ClientIcon />,
      label: 'Клиенты'
    },
    {
      path: '/admin/companies',
      icon: <CompanyIcon />,
      label: 'Компании'
    },
    {
      path: '/admin/settings',
      icon: <SettingsIcon />,
      label: 'Настройки'
    }
  ];

  return (
    <div className={s.bottomBar}>
      {menuItems.map((item, index) => (
        <div 
          key={index}
          className={`${s.item} ${location.pathname === item.path ? s.active : ''}`}
          onClick={() => navigate(item.path)}
        >
          <div className={s.iconWrapper}>
            {item.icon}
            {item.badge > 0 && (
              <span className={s.badge}>{item.badge}</span>
            )}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default BottomBar
