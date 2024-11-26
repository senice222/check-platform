import React, { useEffect, useState } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  styles?: React.CSSProperties,
  deskription?: string,
  title: string
}

const Modal: React.FC<ModalProps> = ({ children, isOpened, setOpen, title, deskription }) => {
  const [isRendered, setIsRendered] = useState(false); // Отвечает за наличие компонента в DOM
  const [isClosing, setIsClosing] = useState(false); // Запускает анимацию закрытия

  useEffect(() => {
    if (isOpened) {
      setIsRendered(true); // Показываем модальное окно
    } else if (isRendered) {
      setIsClosing(true); // Запускаем анимацию закрытия
      const timer = setTimeout(() => {
        setIsClosing(false); // Сбрасываем состояние
        setIsRendered(false); // Удаляем из DOM
      }, 300); // Время анимации должно совпадать с CSS
      return () => clearTimeout(timer); // Чистим таймер при размонтировании
    }
  }, [isOpened, isRendered]);

  const handleClose = () => {
    setIsClosing(true); // Запускаем анимацию закрытия
    const timer = setTimeout(() => {
      setOpen(false); // Меняем состояние открытия
      setIsClosing(false); // Сбрасываем состояние
      setIsRendered(false); // Убираем из DOM
    }, 300);
    return () => clearTimeout(timer);
  };

  if (!isRendered) return null; // Убираем из DOM, если окно не активно

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : styles.fadeIn}`}
      onClick={handleClose}
    >
      <div
        style={styles}
        className={`${styles.modal} ${isClosing ? styles.slideOut : styles.slideIn}`}
        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие клика
      >
        <div className={styles.content}>
          <h1 className={styles.heading}>{title}</h1>
          {deskription && <p className={styles.desk}>{deskription}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
