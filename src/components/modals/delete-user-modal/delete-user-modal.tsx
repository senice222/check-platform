import React, { FC } from 'react';
import s from './delete-user-modal.module.scss';
import Button from '../../ui/button/button';
import Modal from '../../ui/modal/modal';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  isBlocking: boolean;
  name: string;
  customTexts?: {
    title?: string;
    description?: string;
    buttonLabel?: string;
  };
}

const DeleteUserModal: FC<Props> = ({ isOpened, setOpen, isBlocking, name, customTexts }) => {
  const { addNotification } = useNotification();

  const defaultTexts = {
    title: isBlocking 
      ? `Вы уверены, что хотите заблокировать клиента ${name}?` 
      : `Вы уверены, что хотите разблокировать клиента ${name}?`,
    description: isBlocking 
      ? `Клиент потеряет доступ к платформе. Вы всегда сможете его разблокировать` 
      : `Клиент снова сможет получить доступ к платфор��е. Вы всегда сможете его заблокировать снова.`,
    buttonLabel: isBlocking ? 'Заблокировать' : 'Разблокировать'
  };

  const texts = {
    title: customTexts?.title || defaultTexts.title,
    description: customTexts?.description || defaultTexts.description,
    buttonLabel: customTexts?.buttonLabel || defaultTexts.buttonLabel
  };

  const deleteUser = () => {
    addNotification(
      isBlocking 
        ? `Клиент ${name} успешно заблокирован.`
        : `Клиент ${name} успешно разблокирован.`,
      "success"
    );
    setOpen(false);
  }

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
          onClick={deleteUser} 
          label={texts.buttonLabel} 
        />
      </div>
    </Modal>
  )
}

export default DeleteUserModal