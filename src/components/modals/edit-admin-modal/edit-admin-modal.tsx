import React, { FC, useEffect, useState } from 'react';
import s from './edit-admin-modal.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';
import Input from '../../ui/input/input';
import { DetailedAvatar } from '../../svgs/svgs';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  defaultValue: {
    name: string;
    login: string;
    password: string;
  };
  isCreating?: boolean;
}

const EditAdminModal: FC<Props> = ({ isOpened, setOpen, defaultValue, isCreating = false }) => {
  const { addNotification } = useNotification();
  const [name, setName] = useState(defaultValue.name);
  const [login, setLogin] = useState(defaultValue.login);
  const [password, setPassword] = useState(defaultValue.password);
  const [isSecondStep, setIsSecondStep] = useState(false);

  const platformLink = "https://platform-name.com"; // Замените на реальную ссылку

  useEffect(() => {
    setName(defaultValue.name);
    setLogin(defaultValue.login);
    setPassword(defaultValue.password);
    setIsSecondStep(false);
  }, [defaultValue, isOpened]);

  const generatePassword = () => {
    const length = 15;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(generatedPassword);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addNotification("Скопировано в буфер обмена", "success");
    } catch (err) {
      addNotification("Не удалось скопировать", "error");
    }
  };

  const copyAll = () => {
    const allInfo = `Ссылка: ${platformLink}\nЛогин: ${login}\nПароль: ${password}`;
    copyToClipboard(allInfo);
  };

  const showSuccess = () => {
    addNotification(
      isCreating 
        ? `Пользователь ${name} успешно создан.`
        : `Пользователь ${name} успешно отредактирован.`, 
      "success"
    );
    if (isCreating) {
      setIsSecondStep(true);
    } else {
      setOpen(false);
    }
  };

  if (isSecondStep) {
    return (
      <Modal 
        title="Данные для входа"
        deskription="Передайте ему ссылку на платформу и данные для входа"
        setOpen={setOpen} 
        isOpened={isOpened}
      >
        <div className={s.content}>
          <div className={s.userInfo}>
            <DetailedAvatar />
            <span className={s.userName}>{name}</span>
          </div>
          
          <div className={s.inputWrapper}>
            <Input 
              label="Ссылка для входа на платформу"
              value={platformLink}
              disabled
              style={{ paddingRight: '100px' }}
            />
            <button 
              className={s.copyBtn} 
              onClick={() => copyToClipboard(platformLink)}
            >
              Скопировать
            </button>
          </div>

          <div className={s.inputWrapper}>
            <Input 
              label="Логин"
              value={login}
              disabled
              style={{ paddingRight: '100px' }}
            />
            <button 
              className={s.copyBtn} 
              onClick={() => copyToClipboard(login)}
            >
              Скопировать
            </button>
          </div>

          <div className={s.inputWrapper}>
            <Input 
              label="Пароль"
              value={password}
              disabled
              style={{ paddingRight: '100px' }}
            />
            <button 
              className={s.copyBtn} 
              onClick={() => copyToClipboard(password)}
            >
              Скопировать
            </button>
          </div>
        </div>

        <div className={s.actions}>
          <Button 
            style={{ width: '172px', height: '40px' }} 
            styleLabel={{ fontSize: '14px', fontWeight: '500' }} 
            variant='white' 
            label='Закрыть' 
            onClick={() => {
              setOpen(false);
              setIsSecondStep(false);
            }} 
          />
          <Button 
            style={{ width: '172px', height: '40px' }} 
            styleLabel={{ fontSize: '14px', fontWeight: '500', color: 'white' }} 
            variant='purple' 
            label='Скопировать все'
            onClick={copyAll}
          />
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal 
      title={isCreating ? 'Создание пользователя' : 'Редактирование пользователя'} 
      setOpen={setOpen} 
      isOpened={isOpened}
    >
      <div className={s.content}>
        <Input 
          noMargin={true} 
          label='ФИО' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <div className={s.inputWrapper}>
          <Input 
            noMargin={true}
            label='Логин' 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
          />
        </div>
        <div className={s.passwordInput}>
          <Input 
            noMargin={true}
            label='Пароль' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ paddingRight: '100px' }}
          />
          <button className={s.generateBtn} onClick={generatePassword}>
            Сгенерировать
          </button>
        </div>
      </div>
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
          variant='purple' 
          label={isCreating ? 'Создать' : 'Сохранить'}
          onClick={() => {
            showSuccess();
          }} 
        />
      </div>
    </Modal>
  );
};

export default EditAdminModal; 