import { AppProviders } from './app-providers';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from 'react';
import DetailedClient from '../pages/detailed-client/detailed-client';
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
      path: "/admin",
      element: <PanelLayout />,
      children: [
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
      ],
   },
]);

function App() {
   return (
      <AppProviders>
         <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
         </Suspense>
      </AppProviders>
   );
}

export default App;

