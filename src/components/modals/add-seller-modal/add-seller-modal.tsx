import React, { FC, useEffect, useState } from 'react'
import s from './add-seller-modal.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import Input from '../../ui/input/input'
import TypeSelect from '../../ui/type-select/type-select'
import { mockData } from '../../../pages/settings/mock-data'
interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    isEditing: typeof mockData[0] | false;
    setIsEditing: (isEditing: typeof mockData[0] | false) => void;
}

const AddSellerModal: FC<Props> = ({ isOpened, setOpen, isEditing, setIsEditing }) => {
    const [name, setName] = useState(isEditing ? isEditing.name : '');
    const [inn, setInn] = useState(isEditing ? isEditing.inn : '');
    const [telegram, setTelegram] = useState(isEditing ? isEditing.telegram : '');
    const [selectedType, setSelectedType] = useState<'elite' | 'white' | ''>('');
    useEffect(() => {
        if (isEditing) {
            setName(isEditing.name)
            setInn(isEditing.inn)
            setTelegram(isEditing.telegram)
            setSelectedType(isEditing.type)
        } else{
            setName('')
            setInn('')
            setTelegram('')
            setSelectedType('')
        }
    }, [isEditing])
        return (
            <Modal title={isEditing ? 'Редактировать продавца' : 'Добавить продавца'} setOpen={setOpen} isOpened={isOpened}>
            <div className={s.content}>
                <Input 
                    noMargin={true} 
                    label='Название компании' 
                    placeholder='Введите название компании' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <Input 
                    noMargin={true} 
                    label='ИНН' 
                    placeholder='Введите ИНН' 
                    value={inn} 
                    onChange={(e) => setInn(e.target.value)} 
                />
                <Input 
                    noMargin={true} 
                    label='Telegram-канал компании' 
                    placeholder='Введите ссылку' 
                    value={telegram} 
                    onChange={(e) => setTelegram(e.target.value)} 
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
                    onClick={() => setOpen(false)}
                    variant="white"
                    style={{width: "100%", height: "46px"}}
                    styleLabel={{fontSize: "14px", fontWeight: "500"}}
                />
                {
                    isEditing ? (
                        <Button 
                            label="Сохранить" 
                            variant="purple"
                            style={{width: "100%", height: "46px"}}
                            styleLabel={{fontSize: "14px", fontWeight: "500"}}
                        />
                    ) : (
                        <Button 
                            label="Добавить" 
                            variant="purple"
                            style={{width: "100%", height: "46px"}}
                            styleLabel={{fontSize: "14px", fontWeight: "500"}}
                        />
                    )
                }
            </div>
        </Modal>
    )
}

export default AddSellerModal