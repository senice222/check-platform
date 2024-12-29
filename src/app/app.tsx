import { AppProviders } from './app-providers';

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Suspense, lazy } from 'react';
import DetailedClient from '../pages/detailed-client/detailed-client';
import DetailedCompany from '../pages/detailed-company/detailed-company';
import Clients from '../pages/clients/clients';
import Companies from '../pages/companies/companies';
import Settings from '../pages/settings/settings';
import SellersSection from '../pages/settings/components/sellers-section/sellers-section';
import AccessSection from '../pages/settings/components/access-section/access-section';
import { NotificationProvider } from '../contexts/NotificationContext/NotificationContext';
import ClientMain from '../pages/client-main/client-main';
const AdminLogin = lazy(() => import('../pages/admin-login/admin-login'));
const PanelLayout = lazy(() => import('../layouts/panel-layout/panel-layout'));
const ActiveApplications = lazy(() => import('../components/active-applications/active-applications'));
const ApplicationDetailed = lazy(() => import('../pages/application-detailed/application-detailed'));
const Checks = lazy(() => import('../pages/checks/checks'));

const router = createBrowserRouter([
   {
      path: "/admin/login",
      element: <AdminLogin />,
   },
   {
      path: "client-main",
      element: <ClientMain />,
   },
   {
      path: "/admin",
      element: <PanelLayout />,
      children: [
         {
            path: "clients",
            element: <Clients />,
         },

         {
            path: "active-applications",
            element: <ActiveApplications isActiveOnly={true} />,
         },
         {
            path: "applications",
            element: <ActiveApplications isActiveOnly={false} />,
         },
         {
            path: "application/:id",
            element: <ApplicationDetailed />,
         },
         {
            path: "checks",
            element: <Checks />,
         },
         {
            path: "detailed-client/:id",
            element: <DetailedClient />,
         },
         {
            path: "settings",
            element: <Settings />,
            children: [
               {
                  path: "sellers",
                  element: <SellersSection />,
               },
               {
                  path: "access",
                  element: <AccessSection />,
               }
            ]
         },
         {
            path: "detailed-company/:id",
            element: <DetailedCompany />,
         },
         {
            path: "companies",
            element: <Companies />,
         }
      ],
   },
]);

function App() {
   return (
      <AppProviders>
         <Suspense fallback={<div>Loading...</div>}>
            <NotificationProvider>
               <RouterProvider router={router} />
            </NotificationProvider>
         </Suspense>
      </AppProviders>
   );
}

export default App;

