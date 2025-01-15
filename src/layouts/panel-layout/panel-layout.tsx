import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import styles from './panel-layout.module.scss'
import Sidebar from '../../components/sidebar/sidebar';
import BottomBar from '../../components/bottom-bar/bottom-bar';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkAuth } from '../../store/slices/adminSlice';

const PanelLayout = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const [isChecking, setIsChecking] = useState(true);
   const { currentAdmin, isLoading } = useAppSelector(state => state.admin);
   const token = localStorage.getItem('token');

   useEffect(() => {
      const checkAdminAuth = async () => {
         if (!token) {
            setIsChecking(false);
            return;
         }

         try {
            await dispatch(checkAuth()).unwrap();
         } catch (error) {
            // localStorage.removeItem('token');
         } finally {
            setIsChecking(false);
         }
      };

      checkAdminAuth();
   }, [dispatch]);

   // Показываем загрузку пока проверяем авторизацию
   if (isChecking || isLoading) {
      return <div>Загрузка...</div>;
   }
   console.log(currentAdmin)
   // Если нет токена или нет админа после проверки - редиректим
   if (!token || !currentAdmin) {
      return <Navigate to="/admin/login" replace />;
   }

   return (
      <div className={styles.layout}>
         <BottomBar />
         <Sidebar />
         <div className={styles.content}>
            <Outlet />
         </div>
      </div>
   );
};

export default PanelLayout;
