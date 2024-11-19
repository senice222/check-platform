import { AppProviders } from './app-providers';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from 'react';
const AdminLogin = lazy(() => import('../pages/admin-login/admin-login'));
const PanelLayout = lazy(() => import('../layouts/panel-layout/panel-layout'));
const ActiveApplications = lazy(() => import('../components/active-applications/active-applications'));
const ApplicationDetailed = lazy(() => import('../pages/application-detailed/application-detailed'));

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
            element: <ActiveApplications />,
         },
         {
            path: "application/:id",
            element: <ApplicationDetailed />,
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

