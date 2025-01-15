import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import s from './client-login.module.scss';
import Button from '../../components/ui/button/button';
import { useAppDispatch } from '../../hooks/redux';
import { loginClient } from '../../store/slices/clientSlice';
import { useNotification } from '../../contexts/NotificationContext/NotificationContext';

const ClientLogin = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (key) {
            handleLogin();
        }
    }, [key]); // Автоматический вход при наличии ключа

    const handleLogin = async () => {
        if (!key) {
            addNotification('Ключ доступа не найден', 'error');
            return;
        }

        try {
            setIsLoading(true);
            await dispatch(loginClient(key)).unwrap();
            navigate('/client/main');
            addNotification('Успешный вход', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Ошибка при входе', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={s.loginPage}>
            <div className={s.loginCard}>
                <h1>Вход для клиента</h1>
                <p className={s.description}>
                    {isLoading ? 'Выполняется вход...' : 'Используйте ключ доступа, предоставленный администратором'}
                </p>
                <div className={s.keyDisplay}>
                    <span>Ваш ключ:</span>
                    <code>{key}</code>
                </div>
                <Button
                    variant="purple"
                    label={isLoading ? 'Вход...' : 'Войти'}
                    onClick={handleLogin}
                    style={{ width: '100%', height: '40px' }}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};

export default ClientLogin;
