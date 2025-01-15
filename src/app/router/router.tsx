import { createBrowserRouter } from 'react-router-dom';
import React, { useMemo } from 'react';
import PanelLayout from '../../layouts/panel-layout/panel-layout';
import AccessSection from '../../pages/settings/components/access-section/access-section';
import ProtectedSuperAdmin from '../../components/protected-super-admin/protected-super-admin';
import AdminLogin from '../../pages/admin-login/admin-login';
import ClientLogin from '../../pages/client-login/client-login';
import ClientMain from '../../pages/client-main/client-main';
import ProtectedClientRoute from '../../components/protected-client-route/protected-client-route';

export const router = createBrowserRouter([
    {
        path: '/admin/login',
        element: <AdminLogin />
    },
    {
        path: '/admin',
        element: <PanelLayout />,
        children: [
            {
                path: 'settings/access',
                element: (
                    <ProtectedSuperAdmin>
                        <AccessSection />
                    </ProtectedSuperAdmin>
                )
            },
            // ... другие роуты
        ]
    },
    {
        path: '/client/login/:key',
        element: <ClientLogin />
    },
    {
        path: '/client',
        element: (
            <ProtectedClientRoute>
                <ClientMain />
            </ProtectedClientRoute>
        )
    },
    // ... другие маршруты
]); 