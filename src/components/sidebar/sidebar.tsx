import styles from './sidebar.module.scss'
import avatar from '../../assets/Avatar.png'
import logout from '../../assets/logout.png'
import active from '../../assets/activezayvki.png'
import applications from '../../assets/zayavki.png'
import checki from '../../assets/4eki.png'
import clients from '../../assets/clients.png'
import companies from '../../assets/companies.png'
import settings from '../../assets/settings.png'
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
   const navigate = useNavigate();
   const location = useLocation();

   return (
      <div
         className={styles.navBarWrapper}
      >
         <div className={styles.user}>
            <div className={styles.userInfo}>
               <img src={avatar} className={styles.avatar} alt="/" />
               <div>
                  <h2>Вероника</h2>
                  <p>Администратор</p>
               </div>
            </div>
            <img src={logout} className={styles.logout} alt="/" />
         </div>
         <ul className={styles.menu}>
            <li
               className={`${styles.item} ${location.pathname === '/admin/active-applications' ? styles.active : ''}`}
               onClick={() => navigate('/admin/active-applications')}
            >
               <img src={active} alt="/" />
               Активные заявки
               <div className={styles.badgeDiv}>
                  <span className={styles.badge}>3</span>
               </div>
            </li>
            <li
               className={`${styles.item} ${location.pathname === '/admin/applications' ? styles.active : ''}`}
               onClick={() => navigate('/admin/applications')}
            >
               <img src={applications} alt="/" />
               Заявки
            </li>
            <li
               className={`${styles.item} ${location.pathname === '/admin/checks' ? styles.active : ''}`}
               onClick={() => navigate('/admin/checks')}
            >
               <img src={checki} alt="/" />
               Чеки
            </li>
            <li className={`${styles.item} ${location.pathname === '/admin/clients' ? styles.active : ''}`}
               onClick={() => navigate('/admin/clients')}>
               <img src={companies} alt="/" />
               Клиенты
            </li>
            <li className={styles.item} onClick={() => navigate('/admin/companies')}>
               <img src={active} alt="/" />
               Компании
            </li>
            <li onClick={() => navigate('/admin/settings/sellers')} className={styles.item}>
               <img src={settings} alt="/" />
               Настройки
            </li>
         </ul>
      </div>
   );
};

export default Sidebar;
