import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface ProtectedSuperAdminProps {
    children: React.ReactNode;
}

const ProtectedSuperAdmin: React.FC<ProtectedSuperAdminProps> = ({ children }) => {
    const { currentAdmin } = useAppSelector(state => state.admin);

    if (!currentAdmin?.isSuperAdmin) {
        return <Navigate to="/admin/active-applications" replace />;
    }

    return <>{children}</>;
};

export default ProtectedSuperAdmin; 