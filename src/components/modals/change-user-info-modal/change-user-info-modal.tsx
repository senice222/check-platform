import React, { FC, useEffect, useState } from 'react';
import s from './change-user-info-modal.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';
import Input from '../../ui/input/input';
import CheckBox from '../../ui/check-box/check-box';
import { useAppDispatch } from '../../../hooks/redux';
import { updateClient, fetchUserInfo } from '../../../store/slices/clientSlice';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  defaultValue: string;
  handleUpdate?: (name: string) => void;
  clientId?: string;
  canSave?: boolean;
  isBlocked?: boolean;
  isCompany?: boolean;
}

const ChangeUserInfoModal: FC<Props> = ({ 
  isOpened, 
  setOpen, 
  defaultValue, 
  handleUpdate,
  clientId,
  canSave = false,
  isBlocked = false,
  isCompany = false
}) => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  const [name, setName] = useState(defaultValue);
  const [isChecked, setIsChecked] = useState(canSave);
  
  useEffect(() => {
    setName(defaultValue);
    setIsChecked(canSave);
  }, [defaultValue, canSave]);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        addNotification(
          isCompany ? 'Название компании не может быть пустым' : 'Имя пользователя не может быть пустым', 
          'error'
        );
        return;
      }

      if (clientId && !isCompany) {
        await dispatch(updateClient({
          clientId,
          data: {
            name: name.trim(),
            canSave: isChecked,
          }
        })).unwrap();
        
        await dispatch(fetchUserInfo(clientId));
        
        addNotification('Информация успешно обновлена', 'success');
      } else if (handleUpdate) {
        handleUpdate(name.trim());
      }

      setOpen(false);
    } catch (error: any) {
      addNotification(
        error.message || 'Произошла ошибка при обновлении информации', 
        'error'
      );
    }
  };

  const handleClose = () => {
    setName(defaultValue);
    setIsChecked(canSave);
    setOpen(false);
  };

  return (
    <Modal 
      title={isCompany ? 'Редактирование компании' : 'Редактирование клиента'} 
      setOpen={setOpen} 
      isOpened={isOpened}
    >
      <div className={s.content}>
        <Input
          label={isCompany ? "Название компании" : "Имя пользователя"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        {!isCompany && (
          <div className={s.checkboxContainer}>
            <CheckBox
              isChecked={isChecked}
              setChecked={() => setIsChecked(!isChecked)}
            />
            <p>Разрешить сохранять компании</p>
          </div>
        )}

        <div className={s.actions}>
          <Button
            label="Отмена"
            variant="white"
            onClick={handleClose}
            style={{ width: "172px", height: "40px" }}
            styleLabel={{ fontSize: "14px", fontWeight: "500" }}
          />
          <Button
            label="Сохранить"
            variant="purple"
            onClick={handleSave}
            style={{ width: "172px", height: "40px" }}
            styleLabel={{ fontSize: "14px", fontWeight: "500", color: "white" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChangeUserInfoModal;
