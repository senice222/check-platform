import React, { FC, useState } from 'react'
import s from './clear-comments.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    onConfirm: () => Promise<void>;
}

const ClearComments: FC<Props> = ({ isOpened, setOpen, onConfirm }) => {
    const [isDeleting, setDeleting] = useState(false);
    const { addNotification } = useNotification();

    const handleClear = async () => {
        setDeleting(true);
        try {
            await onConfirm();
            // Успешное уведомление будет показано в родительском компоненте
        } catch (error) {
            // Ошибка будет обработана в родительском компоненте
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal 
            title='Вы уверены, что хотите очистить комментарии по заявке?' 
            deskription='Это действие необратимо.' 
            setOpen={setOpen} 
            isOpened={isOpened}
        >
            <div className={s.actions}>
                <Button 
                    style={{width: '172px', height: '40px'}} 
                    styleLabel={{fontSize: '14px', fontWeight: '500'}} 
                    variant='white' 
                    label='Закрыть' 
                    onClick={() => setOpen(false)}
                    disabled={isDeleting}
                />
                <Button 
                    style={{width: '172px', height: '40px'}} 
                    styleLabel={{fontSize: '14px', fontWeight: '500', color: 'white'}} 
                    variant='purple' 
                    onClick={handleClear} 
                    label='Очистить чат'
                    loading={isDeleting}
                    disabled={isDeleting}
                />
            </div>
        </Modal>
    );
};

export default ClearComments;