import React from 'react';
import styles from './access-denied.module.scss';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h1>Доступ запрещен</h1>
                <p>У вас нет прав для просмотра этого раздела</p>
                <button 
                    className={styles.button}
                    onClick={() => navigate('/admin/active-applications')}
                >
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
};

export default AccessDenied; 