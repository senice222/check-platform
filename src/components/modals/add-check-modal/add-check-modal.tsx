import React, { FC, useState, useEffect } from 'react'
import s from './add-check-modal.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import Input from '../../ui/input/input'
import DateSelector from '../../ui/date-selector/date-selector'

interface CheckData {
  id?: string;
  date: string;
  product: string;
  unit: string;
  quantity: string;
  priceWithVAT: string;
  totalWithVAT: string;
  vat20: string;
}

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  editData?: CheckData; // Данные для редактирования
  onSubmit: (data: CheckData) => void; // Колбэк для сохранения/добавления
}

const AddCheckModal: FC<Props> = ({ 
  isOpened, 
  setOpen, 
  editData,
  onSubmit 
}) => {
  const [date, setDate] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [priceWithVat, setPriceWithVat] = useState('');
  const [totalWithVat, setTotalWithVat] = useState('');
  const [vat, setVat] = useState('');

  // Форматирование числа для отображения
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Очистка строки от форматирования для вычислений
  const cleanNumberString = (str: string): number => {
    return Number(str.replace(/[^\d.-]/g, ''));
  };

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (editData) {
      setDate(editData.date);
      setProduct(editData.product);
      setQuantity(editData.quantity);
      setUnit(editData.unit);
      setPriceWithVat(editData.priceWithVAT.replace(/[^\d.-]/g, '')); // Очищаем от форматирования
      setTotalWithVat(editData.totalWithVAT);
      setVat(editData.vat20);
    }
  }, [editData]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpened) {
      setDate('');
      setProduct('');
      setQuantity('');
      setUnit('');
      setPriceWithVat('');
      setTotalWithVat('');
      setVat('');
    }
  }, [isOpened]);

  useEffect(() => {
    if (quantity && priceWithVat) {
      const quantityNum = cleanNumberString(quantity);
      const priceNum = cleanNumberString(priceWithVat);
      
      if (!isNaN(quantityNum) && !isNaN(priceNum)) {
        const total = quantityNum * priceNum;
        const vatAmount = total * 0.2;
        
        setTotalWithVat(formatNumber(total));
        setVat(formatNumber(vatAmount));
      }
    } else {
      setTotalWithVat('0.00');
      setVat('0.00');
    }
  }, [quantity, priceWithVat]);

  const handleDateChange = (startDate: string) => {
    setDate(startDate);
  };

  const handleSubmit = () => {
    const checkData: CheckData = {
      id: editData?.id,
      date,
      product,
      unit,
      quantity,
      priceWithVAT: formatNumber(cleanNumberString(priceWithVat)),
      totalWithVAT: totalWithVat,
      vat20: vat
    };

    onSubmit(checkData);
    setOpen(false);
  };

  return (
    <Modal 
      title={editData ? "Редактирование чека" : "Новый чек"}
      setOpen={setOpen} 
      isOpened={isOpened}
      maxWidth
    >
      <div className={s.content}>
        <DateSelector 
          onDateChange={handleDateChange}
          fullWidth={true}
          closeOnClickOutside={true}
          singleDate 
          inputStyle
          label="Дата"
          value={date}
        />
        
        <Input 
          label="Товар"
          placeholder="Введите название товара"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <div className={s.row}>
          <Input 
            label="Количество"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Input 
            label="Единица измерения"
            placeholder="шт"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <Input 
          label="Цена за единицу с НДС"
          placeholder="0.00 ₽"
          noMargin={true}
          value={priceWithVat}
          onChange={(e) => setPriceWithVat(e.target.value)}
        />

        <div className={s.separator}>
          <p>Поля ниже заполняются автоматически</p>
        </div>

        <div className={s.row}>
          <Input 
            label="Стоимость с НДС"
            value={`${totalWithVat} ₽`}
            disabled
          />
          <Input 
            label="НДС 20%"
            value={`${vat} ₽`}
            disabled
          />
        </div>
      </div>

      <div className={s.actions}>
        <Button 
          label="Отмена" 
          variant="white"
          onClick={() => setOpen(false)}
          style={{width: "100%", height: "40px"}}
          styleLabel={{fontSize: "14px", fontWeight: "500"}}
        />
        <Button 
          label={editData ? "Сохранить изменения" : "Добавить чек"}
          variant="purple"
          onClick={handleSubmit}
          style={{width: "100%", height: "40px"}}
          styleLabel={{fontSize: "14px", fontWeight: "500"}}
        />
      </div>
    </Modal>
  )
}

export default AddCheckModal 