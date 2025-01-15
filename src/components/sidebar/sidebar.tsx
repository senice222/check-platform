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
import { useSelector } from 'react-redux';
import { selectActiveApplicationsCount } from '../../store/slices/applicationSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchActiveApplicationsCount } from '../../store/slices/applicationSlice';
import { AppDispatch } from '../../store/store';
import { useAppSelector } from '../../hooks/redux'

const Sidebar = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch<AppDispatch>();
   const { currentAdmin, isLoading } = useAppSelector(state => state.admin);

   // Получаем количество активных заявок из Redux
   const activeApplicationsCount = useSelector(selectActiveApplicationsCount);

   // Загружаем все активные заявки при монтировании компонента
   useEffect(() => {
      dispatch(fetchActiveApplicationsCount());
   }, [dispatch]);

   const menuItems = [
      {
         path: '/admin/active-applications',
         icon: <img src={active} alt="/" />,
         label: 'Активные заявки',
         badge: activeApplicationsCount
      },
      {
         path: '/admin/applications',
         icon: <img src={applications} alt="/" />,
         label: 'Заявки'
      },
      {
         path: '/admin/checks',
         icon: <img src={checki} alt="/" />,
         label: 'Чеки'
      },
      {
         path: '/admin/clients',
         icon: <img src={companies} alt="/" />,
         label: 'Клиенты'
      },
      {
         path: '/admin/companies',
         icon: <img src={active} alt="/" />,
         label: 'Компании'
      },
      {
         path: '/admin/settings/sellers',
         icon: <img src={settings} alt="/" />,
         label: 'Настройки'
      }
   ];

   return (
      <div className={styles.navBarWrapper}>
         <div className={styles.user}>
            <div className={styles.userInfo}>
               <img src={avatar} className={styles.avatar} alt="/" />
               <div>
                  <h2>{currentAdmin?.name}</h2>
                  <p>Администратор</p>
               </div>
            </div>
            <img src={logout} className={styles.logout} alt="/" />
         </div>
         <ul className={styles.menu}>
            {menuItems.map((item, index) => (
               <li
                  key={index}
                  className={`${styles.item} ${location.pathname === item.path ? styles.active : ''}`}
                  onClick={() => navigate(item.path)}
               >
                  {item.icon}
                  {item.label}
                  {item.badge > 0 && (
                     <div className={styles.badgeDiv}>
                        <span className={styles.badge}>{item.badge}</span>
                     </div>
                  )}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Sidebar;
