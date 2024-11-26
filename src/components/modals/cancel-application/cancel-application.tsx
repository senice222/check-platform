import React, { FC } from 'react';
import s from './cancel-application.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  setEditing: () => void;
}

const CancelApplication: FC<Props> = ({ isOpened, setOpen }) => {
  const { addNotification } = useNotification();
  const showSuccess = () => {
    addNotification("Комментарии по заявке #01 успешно очищены.", "success");
  };
  
  return (
    <Modal title='Вы уверены, что хотите отменить изменение заявки?' deskription='Внесённые изменения не сохранятся.' setOpen={setOpen} isOpened={isOpened}>
      {/* Содержимое модального окна */}
      
        <div className={s.actions}>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500'}} variant='white' label='Закрыть' onClick={() => setOpen(false)}/>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500', color: 'white'}} variant='purple' label='Отменить изменения' onClick={() => {
            setOpen(false);
            showSuccess();
          }}/>
        </div>

    </Modal>
  );
};

export default CancelApplication;
