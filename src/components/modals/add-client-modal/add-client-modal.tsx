import React, { FC, useState } from 'react'
import s from './add-client-modal.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import { useNotification } from '../../../contexts/NotificationContext/NotificationContext';
import CheckBox from '../../ui/check-box/check-box';
import Input from '../../ui/input/input';
import { ClientAvatar } from '../../svgs/svgs';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;

}
const AddClientModal: FC<Props> = ({ isOpened, setOpen }) => {

    //   const showSuccess = () => {
    //     addNotification("Комментарии по заявке #01 успешно очищены.", "success", () => {
    //       setDeleting(false)
    //     });
    //   };
    const [name, setName] = useState('');
    const [step, setStep] = useState(1);
    const [isChecked, setIsChecked] = useState(false);
    const addClient = () => {
        setStep(2);
        console.log('addClient')
    }
    return (
        <Modal title={step === 1 ? 'Регистрация нового клиента' : `Клиент ${name} зарегистрирован!`} deskription={step === 1 ? undefined : 'Передайте ему ссылку на платформу и данные для входа '} setOpen={setOpen} isOpened={isOpened}>
            {/* Содержимое модального окна */}
            <div className={s.content}>
                {step === 1 ? (
                    <>
                        <Input noMargin={true} label='Имя клиента' value={name} onChange={(e) => setName(e.target.value)} />
                        <div className={s.gratText}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M7.99967 14.6667C4.31767 14.6667 1.33301 11.682 1.33301 8.00004C1.33301 4.31804 4.31767 1.33337 7.99967 1.33337C11.6817 1.33337 14.6663 4.31804 14.6663 8.00004C14.6663 11.682 11.6817 14.6667 7.99967 14.6667ZM7.99967 13.3334C9.41416 13.3334 10.7707 12.7715 11.7709 11.7713C12.7711 10.7711 13.333 9.41453 13.333 8.00004C13.333 6.58555 12.7711 5.229 11.7709 4.2288C10.7707 3.22861 9.41416 2.66671 7.99967 2.66671C6.58519 2.66671 5.22863 3.22861 4.22844 4.2288C3.22824 5.229 2.66634 6.58555 2.66634 8.00004C2.66634 9.41453 3.22824 10.7711 4.22844 11.7713C5.22863 12.7715 6.58519 13.3334 7.99967 13.3334ZM7.33301 4.66671H8.66634V6.00004H7.33301V4.66671ZM7.33301 7.33337H8.66634V11.3334H7.33301V7.33337Z"
                                    fill="#0D1126"
                                    fillOpacity="0.4"
                                />
                            </svg>
                            <p>Отображается только у вас</p>
                        </div>
                        <div className={s.chekboxDiv} onClick={() => setIsChecked(!isChecked)}>
                            <CheckBox isChecked={isChecked} />
                            <p>Возможность сохранения компаний в системе для автозаполнения</p>
                        </div>
                    </>
                ) : (
                    <div className={s.success}>
                        <div className={s.success_header}>
                            <ClientAvatar />
                            <p>{name}</p>
                        </div>
                        <div className={s.linkDiv}>
                            <p className={s.text}>Ссылка для входа на платформу</p>
                            <div className={s.link}>
                                <p>https://platform.com</p>
                                <div className={s.copy}>
                                    Скопировать
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <div className={s.actions}>
               {step === 1 ? <> <Button style={{ width: '172px', height: '40px' }} styleLabel={{ fontSize: '14px', fontWeight: '500' }} variant='white' label='Закрыть' onClick={() => setOpen(false)} />
               <Button style={{ width: '172px', height: '40px' }} styleLabel={{ fontSize: '14px', fontWeight: '500', color: 'white' }} variant='purple' onClick={() => addClient()} label='Зарегистрировать' /></> : <Button style={{ width: '100%', height: '40px' }} styleLabel={{ fontSize: '14px', fontWeight: '500' }} variant='white' label='Закрыть' onClick={() => {
                setStep(1);
                setOpen(false);
               }} />}
            </div>

        </Modal>
    )
}

export default AddClientModal