import React from 'react';
import { DownloadSvg, Plus } from '../../components/svgs/svgs';
import Button from '../../components/ui/button/button';
import s from './checks-info.module.scss';

interface ChecksInfoProps {
  dates: string;
  checksCount: number;
  sumWithVat: string;
  vat: string;
  onAddCheck: () => void;
  isApplicationMode?: boolean;
}

const ChecksInfo: React.FC<ChecksInfoProps> = ({
  dates,
  checksCount,
  sumWithVat,
  vat,
  onAddCheck,
  isApplicationMode = false
}) => {
  return (
    <div className={`${s.checks} ${isApplicationMode ? s.applicationMode : ''}`}>
      {/* Десктопная версия */}
      <div className={s.checkInfoListDesktop}>
        <div className={s.item}>
          <p>Даты</p>
          <h4>{dates}</h4>
        </div>
        <div className={s.item}>
          <p>Кол-во чеков</p>
          <h4>{checksCount}</h4>
        </div>
        <div className={s.item}>
          <p>Сумма с НДС</p>
          <h4>{sumWithVat}</h4>
        </div>
        <div className={s.item}>
          <p>НДС 20%</p>
          <h4>{vat}</h4>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className={s.checkInfoListMobile}>
        <div className={s.mobileItem}>
          <div className={s.cell}>
            <div className={s.label}>Даты</div>
            <div className={s.value}>{dates}</div>
          </div>
          <div className={s.cell}>
            <div className={s.label}>Кол-во чеков:</div>
            <div className={s.value}>{checksCount}</div>
          </div>
          <div className={s.cell}>
            <div className={s.label}>Сумма с НДС:</div>
            <div className={s.value}>{sumWithVat}</div>
          </div>
          <div className={s.cell}>
            <div className={s.label}>НДС 20%:</div>
            <div className={s.value}>{vat}</div>
          </div>
          <button className={s.addCheckButton} onClick={onAddCheck}>
            <Plus />
            Добавить чек
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecksInfo; 