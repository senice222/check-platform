import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { checkClientAuth } from '../../store/slices/clientSlice';
import Loader from '../../components/ui/loader/loader';

const ClientLayout = () => {
   const dispatch = useAppDispatch();
   const [isChecking, setIsChecking] = useState(true);
   const { currentClient, isLoading } = useAppSelector(state => state.client);
   const token = localStorage.getItem('client');

   useEffect(() => {
      const checkAuth = async () => {
         if (!token) {
            setIsChecking(false);
            return;
         }

         try {
            await dispatch(checkClientAuth()).unwrap();
         } catch (error) {
            // localStorage.removeItem('client');
         } finally {
            setIsChecking(false);
         }
      };

      checkAuth();
   }, [dispatch]);

   // Показываем загрузку пока проверяем авторизацию
   if (isChecking || isLoading) {
      return <Loader />;
   }

   // Если нет токена или нет клиента после проверки - редиректим
   if (!token || !currentClient) {
      return <Navigate to="/client/login" replace />;
   }

   return <Outlet />;
};

export default ClientLayout; 