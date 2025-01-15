import { useEffect } from 'react';
import { useAppDispatch } from './hooks/redux';
import { checkAuth } from './store/slices/adminSlice';
import { checkClientAuth } from './store/slices/clientSlice';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Проверяем оба типа авторизации при загрузке
        dispatch(checkAuth());
        dispatch(checkClientAuth());
    }, [dispatch]);

    return (
        // ... остальной код
    );
} 