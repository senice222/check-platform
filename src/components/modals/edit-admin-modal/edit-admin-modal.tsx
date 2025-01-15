import React, { FC, useEffect, useState } from 'react';
import s from './edit-admin-modal.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';
import Input from '../../ui/input/input';
import { DetailedAvatar } from '../../svgs/svgs';
import { useAppSelector } from '../../../hooks/redux';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  defaultValue: {
    id?: string;
    name: string;
    login: string;
    password: string;
  };
  isCreating?: boolean;
  onSubmit: (data: { name: string; login: string; password: string }) => Promise<void>;
}

const EditAdminModal: FC<Props> = ({ isOpened, setOpen, defaultValue, isCreating = false, onSubmit }) => {
  const { addNotification } = useNotification();
  const [name, setName] = useState(defaultValue.name);
  const [login, setLogin] = useState(defaultValue.login);
  const [password, setPassword] = useState(defaultValue.password);
  const [isSecondStep, setIsSecondStep] = useState(false);
  const [loginError, setLoginError] = useState('');

  const admins = useAppSelector(state => state.admin.admins);

  const platformLink = "https://platform-name.com";

  useEffect(() => {
    if (isOpened) {
      setName(defaultValue.name);
      setLogin(defaultValue.login);
      setPassword(defaultValue.password || '');
      setIsSecondStep(false);
      setLoginError('');
    }
  }, [defaultValue, isOpened]);

  const validateLogin = (newLogin: string) => {
    const existingAdmin = admins.find(admin => 
      admin.login === newLogin && admin.id !== defaultValue.id
    );
    
    if (existingAdmin) {
      setLoginError('Администратор с таким логином уже существует');
      return false;
    }
    
    setLoginError('');
    return true;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogin = e.target.value;
    setLogin(newLogin);
    validateLogin(newLogin);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      addNotification('Введите ФИО', 'error');
      return;
    }

    if (!login.trim()) {
      addNotification('Введите логин', 'error');
      return;
    }

    if (!password.trim()) {
      addNotification('Введите пароль', 'error');
      return;
    }

    try {
      await onSubmit({ name, login, password });
    } catch (error: any) {
      addNotification(error.message || 'Произошла ошибка', 'error');
    }
  };

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
              noMargin={true}
              label='Ссылка на платформу' 
              value={platformLink} 
              readOnly
            />
            <button className={s.copyBtn} onClick={() => copyToClipboard(platformLink)}>
              Скопировать
            </button>
          </div>
          <div className={s.inputWrapper}>
            <Input 
              noMargin={true}
              label='Логин' 
              value={login} 
              readOnly
            />
            <button className={s.copyBtn} onClick={() => copyToClipboard(login)}>
              Скопировать
            </button>
          </div>
          <div className={s.inputWrapper}>
            <Input 
              noMargin={true}
              label='Пароль' 
              value={password} 
              readOnly
            />
            <button className={s.copyBtn} onClick={() => copyToClipboard(password)}>
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
            onChange={handleLoginChange}
            error={loginError} 
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
          onClick={handleSubmit}
          disabled={!!loginError}
        />
      </div>
    </Modal>
  );
};

export default EditAdminModal; 