import React from 'react';
import s from './loading-slider.module.scss';

const LoadingSlider = () => {
  return (
    <div className={s.loadingContainer}>
      <div className={s.spinner}></div>
      <p>Загрузка данных...</p>
    </div>
  );
};

export default LoadingSlider; 