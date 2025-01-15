import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface Props {
    children: React.ReactNode;
}

const ProtectedClientRoute: React.FC<Props> = ({ children }) => {
    const { currentClient } = useAppSelector(state => state.client);
    const clientToken = localStorage.getItem('clientToken');

    if (!clientToken || !currentClient) {
        return <Navigate to="/client/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedClientRoute; 