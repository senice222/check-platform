import React, { FC, useEffect, useState } from 'react'
import s from './add-seller-modal.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import Input from '../../ui/input/input'
import TypeSelect from '../../ui/type-select/type-select'

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    isEditing: any;
    setIsEditing: (isEditing: any) => void;
    onSubmit: (data: {
        name: string;
        inn: string;
        tg_link: string;
        type: 'white' | 'elit';
    }) => void;
}

const AddSellerModal: FC<Props> = ({ 
    isOpened, 
    setOpen, 
    isEditing, 
    setIsEditing,
    onSubmit 
}) => {
    const [name, setName] = useState('');
    const [inn, setInn] = useState('');
    const [telegram, setTelegram] = useState('');
    const [selectedType, setSelectedType] = useState<'white' | 'elit'>('white');
    const [errors, setErrors] = useState({
        name: '',
        inn: '',
        telegram: ''
    });

    useEffect(() => {
        if (isEditing) {
            setName(isEditing.name);
            setInn(isEditing.inn);
            setTelegram(isEditing.telegram);
            setSelectedType(isEditing.type);
        } else {
            resetForm();
        }
    }, [isEditing]);

    const resetForm = () => {
        setName('');
        setInn('');
        setTelegram('');
        setSelectedType('white');
        setErrors({
            name: '',
            inn: '',
            telegram: ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
        resetForm();
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            inn: '',
            telegram: ''
        };

        if (!name.trim()) {
            newErrors.name = 'Введите название компании';
        }

        if (!inn.trim()) {
            newErrors.inn = 'Введите ИНН';
        } else if (!/^\d{10}$|^\d{12}$/.test(inn)) {
            newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
        }

        if (!telegram.trim()) {
            newErrors.telegram = 'Введите ссылку на Telegram';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        onSubmit({
            name,
            inn,
            tg_link: telegram,
            type: selectedType
        });
    };

    return (
        <Modal 
            title={isEditing ? 'Редактировать продавца' : 'Добавить продавца'} 
            setOpen={handleClose} 
            isOpened={isOpened}
        >
            <div className={s.content}>
                <Input 
                    noMargin={true} 
                    label='Название компании' 
                    placeholder='Введите название компании' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                />
                <Input 
                    noMargin={true} 
                    label='ИНН' 
                    placeholder='Введите ИНН' 
                    value={inn} 
                    onChange={(e) => setInn(e.target.value)}
                    error={errors.inn}
                />
                <Input 
                    noMargin={true} 
                    label='Telegram-канал компании' 
                    placeholder='Введите ссылку' 
                    value={telegram} 
                    onChange={(e) => setTelegram(e.target.value)}
                    error={errors.telegram}
                />
                <div className={s.selectWrapper}>
                    <span className={s.selectLabel}>Тип компании</span>
                    <TypeSelect
                        value={selectedType}
                        onChange={setSelectedType}
                    />
                </div>
            </div>
            <div className={s.actions}>
                <Button 
                    label="Закрыть" 
                    onClick={handleClose}
                    variant="white"
                    style={{width: "100%", height: "46px"}}
                    styleLabel={{fontSize: "14px", fontWeight: "500"}}
                />
                <Button 
                    label={isEditing ? "Сохранить" : "Добавить"}
                    variant="purple"
                    style={{width: "100%", height: "46px"}}
                    styleLabel={{fontSize: "14px", fontWeight: "500", color: "white"}}
                    onClick={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default AddSellerModal;