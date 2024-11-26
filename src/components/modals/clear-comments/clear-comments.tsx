import React, { FC, useState } from 'react'
import s from './clear-comments.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
  }
const ClearComments : FC<Props> = ({isOpened, setOpen}) => {
  const [isDeleting, setDeleting] = useState(false)
  const { addNotification } = useNotification();
  console.log(isDeleting)
  const clearComments = () => {
    setDeleting(true); // Устанавливаем состояние
  
    showSuccess(); // Вызываем уведомление
    setOpen(false);
    setTimeout(() => {
      // Используем функцию для получения актуального значения состояния
      setDeleting((currentDeleting) => {
        if (currentDeleting) {
          console.log('comments cleared');
          setDeleting(false)
        } else {
          console.log('cancelled');
        }
        return currentDeleting;
      });
    }, 3000);
  };
  const showSuccess = () => {
    addNotification("Комментарии по заявке #01 успешно очищены.", "success", () => {
      setDeleting(false)
    });
  };
  return (
    <Modal title='Вы уверены, что хотите очистить комментарии по заявке?' deskription='Это действие необратимо.' setOpen={setOpen} isOpened={isOpened}>
      {/* Содержимое модального окна */}
      
        <div className={s.actions}>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500'}} variant='white' label='Закрыть' onClick={() => setOpen(false)}/>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500', color: 'white'}} variant='purple' onClick={() => clearComments()} label='Очистить чат'/>
        </div>

    </Modal>
  )
}

export default ClearComments