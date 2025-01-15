import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface Props {
    children: React.ReactElement;
}

const ProtectedClientRoute: React.FC<Props> = ({ children }) => {
    const { currentClient } = useAppSelector(state => state.client);
    const navigate = useNavigate();
    const token = localStorage.getItem('clientToken');

    useEffect(() => {
        if (!currentClient && !token) {
            navigate('/client/login', { replace: true });
        }
    }, [currentClient, token, navigate]);

    if (!currentClient && !token) {
        return null; // или можно вернуть компонент загрузки
    }

    return children;
};

export default ProtectedClientRoute; 