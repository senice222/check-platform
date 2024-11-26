import React, { createContext, useContext, useState, ReactNode, FC } from "react";
import styles from "./Notification.module.scss";
import { Cross, SuccessIcon } from "../../components/svgs/svgs";

type NotificationStatus = "success" | "error";

interface Notification {
  id: string;
  text: string;
  status: NotificationStatus;
  onClick?: () => void;
}

interface NotificationContextProps {
  addNotification: (text: string, status: NotificationStatus, onClick?: () => void) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const NotificationProvider: FC<ProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Функция для добавления уведомлений
  const addNotification = (text: string, status: NotificationStatus, onClick?: () => void) => {
    const id = new Date().toISOString();
    setNotifications((prev) => [...prev, { id, text, status, onClick }]);

    // Удаление уведомления через 3 секунды
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 3000);
  };

  // Функция для удаления уведомления вручную при клике на крестик
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationList notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationList: FC<NotificationListProps> = ({ notifications, removeNotification }) => {
  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${notification.status === "success" ? styles.success : styles.error}`}
        >
          <div className={styles.notificationdiv}>
            <div className={styles.left}>
              <SuccessIcon />
              <span>{notification.text}</span>
            </div>
            <div
              className={styles.cross}
              onClick={() => removeNotification(notification.id)} // Удаление уведомления при клике на крестик
            >
              <Cross />
            </div>
          </div>

          {notification.onClick && (
            <button className={styles.cancelButton} onClick={() => {
              removeNotification(notification.id)
              if (notification.onClick) {
                notification.onClick()
              }
            }}>
              Отмена
            </button>
          )}
        </div>
      ))}
    </div>
  );
};


