import React from 'react'
import s from './settings.module.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logout from '../../assets/logout.png'
import { BuildingsIcon, KeyIcon } from '../../components/svgs/svgs';


const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('access') ? 'access' : location.pathname.includes('sellers') ? 'sellers' : '';

  return (
    <div className={s.settings}>
      <div className={s.desktop}>
        <h1 className={s.title}>Настройки</h1>
        <div className={s.tabs}>
          <button
            className={`${s.tab} ${activeTab === 'sellers' ? s.active : ''}`}
            onClick={() => navigate('/admin/settings/sellers')}
          >
            Продавцы
          </button>
          <button
            className={`${s.tab} ${activeTab === 'access' ? s.active : ''}`}
            onClick={() => navigate('/admin/settings/access')}
          >
            Доступы
          </button>
        </div>
      </div>
      {activeTab === "" && <div className={s.mobile}>
        <div className={s.mobile_header}>
          <h2>Настройки</h2>
        </div>
        <div className={s.mobile_content}>
          <div className={s.account}>
            <div className={s.left}>
              <div className={s.account_info}>В</div>
              <div className={s.titles}>
                <h2>Виктория</h2>
                <p>Администратор</p>
              </div>
            </div>
            <div className={s.logout}><img src={logout} alt="/" /></div>
          </div>
          <div className={s.hr}></div>
          <div onClick={() => navigate('/admin/settings/sellers')} className={s.link}>
              <BuildingsIcon />
              <h3>Продавцы</h3>
          </div>
          <div onClick={() => navigate('/admin/settings/access')} className={s.link}>
              <KeyIcon />
              <h3>Доступы</h3>
          </div>
        </div>
      </div>}

      <div className={s.outlet}><Outlet /></div>
      {activeTab !== "" && <div className={s.responsive_outlet}><Outlet /></div>}
    </div>
  )
}

export default Settings
