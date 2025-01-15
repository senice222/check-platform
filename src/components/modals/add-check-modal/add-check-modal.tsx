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
    console.log(new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num))
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

  // Расчет общей суммы с НДС
  const calculateTotalWithVat = (quantity: string, priceWithVat: string) => {
    const qty = parseFloat(quantity.replace(/[^\d.-]/g, '') || '0');
    const price = parseFloat(priceWithVat.replace(/[^\d.-]/g, '') || '0');
    return qty * price;
  };

  // Расчет НДС (20% от суммы с НДС)
  const calculateVat = (totalWithVat: number) => {
    // НДС составляет 20/120 от суммы с НДС
    return totalWithVat * (20 / 120);
  };

  // В useEffect для обновления значений
  useEffect(() => {
    if (quantity && priceWithVat) {
      const total = calculateTotalWithVat(quantity, priceWithVat);
      setTotalWithVat(formatNumber(total));
      setVat(formatNumber(calculateVat(total)));
    } else {
      setTotalWithVat('0.00');
      setVat('0.00');
    }
  }, [quantity, priceWithVat]);

  const handleDateChange = (startDate: string) => {
    setDate(startDate);
  };

  const handleSubmit = () => {
    if (!date || !product || !quantity || !unit || !priceWithVat) {
        addNotification('Заполните все поля', 'error');
        return;
    }

    const quantityNum = parseFloat(quantity.replace(/[^\d.-]/g, ''));
    const priceNum = parseFloat(priceWithVat.replace(/[^\d.-]/g, '').replace(',', '.'));
    const totalNum = quantityNum * priceNum;
    const vatNum = totalNum * (20 / 120); // НДС 20% от суммы с НДС

    const checkData = {
        date,
        product,
        unit,
        quantity: quantity,
        priceWithVAT: priceNum.toFixed(2),
        totalWithVAT: totalNum.toFixed(2),
        vat20: vatNum.toFixed(2)
    };

    onSubmit(checkData);
    handleClose();
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
          style={{width: "100%", minHeight: "40px"}}
          styleLabel={{fontSize: "14px", fontWeight: "500"}}
        />
        <Button 
          label={editData ? "Сохранить изменения" : "Добавить чек"}
          variant="purple"
          onClick={handleSubmit}
          style={{width: "100%", minHeight: "40px"}}
          styleLabel={{fontSize: "14px", fontWeight: "500"}}
        />
      </div>
    </Modal>
  )
}

export default AddCheckModal 