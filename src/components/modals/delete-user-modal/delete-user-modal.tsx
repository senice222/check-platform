import React, { FC } from 'react';
import s from './delete-user-modal.module.scss';
import Button from '../../ui/button/button';
import Modal from '../../ui/modal/modal';
import { useAppDispatch } from '../../../hooks/redux';
import { updateClient, deleteClient } from '../../../store/slices/clientSlice';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    isBlocking?: boolean;
    name: string;
    clientId?: string;
    customTexts?: {
        title: string;
        description: string;
        buttonLabel: string;
    };
    customDelete?: () => Promise<void>;
}

const DeleteUserModal: FC<Props> = ({ 
    isOpened, 
    setOpen, 
    isBlocking = false, 
    name, 
    clientId,
    customTexts,
    customDelete
}) => {
    const dispatch = useAppDispatch();
    const { addNotification } = useNotification();

    const handleDelete = async () => {
        try {
            if (customDelete) {
                await customDelete();
            } else {
                if (isBlocking) {
                    await dispatch(updateClient({ id: clientId, isBlocked: true })).unwrap();
                    addNotification('Пользователь успешно заблокирован', 'success');
                } else {
                    await dispatch(deleteClient(clientId)).unwrap();
                    addNotification('Пользователь успешно удален', 'success');
                }
            }
            setOpen(false);
        } catch (error: any) {
            addNotification(error.message || 'Произошла ошибка', 'error');
        }
    };

    const texts = customTexts || {
        title: `Вы уверены, что хотите ${isBlocking ? 'заблокировать' : 'удалить'} пользователя ${name}?`,
        description: isBlocking 
            ? 'Пользователь не сможет авторизоваться в системе'
            : 'Это действие необратимо. Все данные пользователя будут удалены.',
        buttonLabel: isBlocking ? 'Заблокировать' : 'Удалить'
    };

    return (
        <Modal
            danger={true}
            title={texts.title}
            deskription={texts.description}
            setOpen={setOpen}
            isOpened={isOpened}
        >
            <div className={s.actions}>
                <Button 
                    style={{ width: '172px', height: '40px' }}
                    styleLabel={{ fontSize: '14px', fontWeight: '500' }}
                    variant='white'
                    label='Закрыть'
                    onClick={() => setOpen(false)}
                />
                <Button 
                    style={{ width: '172px', height: '40px' }}
                    styleLabel={{ fontSize: '14px', fontWeight: '500', color: 'white' }}
                    variant='danger'
                    onClick={handleDelete}
                    label={texts.buttonLabel}
                />
            </div>
        </Modal>
    );
};

export default DeleteUserModal;