import React from 'react';
import s from './loading.module.scss';

const Loading = () => {
  return (
    <div className={s.loadingContainer}>
      <div className={s.loadingBar}>
        <div className={s.loadingProgress}></div>
      </div>
      <p>Загрузка данных...</p>
    </div>
  );
};

export default Loading; 