import React from 'react';
import Input from '../ui/input/input';
import CustomSelect from '../ui/custom-select/custom-select';
import { Company } from '../../types/company.types';
import { ArrowLink } from '../svgs/svgs';
import s from './info-card.module.scss';

interface Field {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  suffix?: string;
  hideArrow?: boolean;
}

interface InfoCardProps {
  title: string;
  editing: boolean;
  fields?: Field[];
  isCustomSelect?: boolean;
  seller?: {
    id: string;
    name: string;
    inn: string;
  };
  sellers?: Array<{
    id: string;
    name: string;
    inn: string;
    type: 'elite' | 'white';
  }>;
  onSellerChange?: (sellerId: string, sellerInn: string) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  editing,
  fields,
  isCustomSelect,
  seller,
  sellers,
  onSellerChange
}) => {
  const formatSellersForSelect = () => {
    return sellers?.map(s => ({
      name: s.name,
      inn: s.inn,
      type: s.type === 'elite' ? 'elit' : 'standart'
    })) || [];
  };

  return (
    <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
      <h2>{title}</h2>
      {isCustomSelect && seller && sellers && onSellerChange ? (
        <>
          <div className={s.infoItem}>
            <p>Компания</p>
            <div className={s.link}>
              {editing ? (
                <CustomSelect
                  companies={formatSellersForSelect()}
                  defaultValue={{
                    name: seller.name,
                    inn: seller.inn,
                    type: 'standart'
                  }}
                  onChange={(selected) => {
                    const originalSeller = sellers.find(s => s.inn === selected.inn);
                    if (originalSeller) {
                      onSellerChange(originalSeller.id, originalSeller.inn);
                    }
                  }}
                />
              ) : (
                <>
                  <h3>{seller.name}</h3>
                  <ArrowLink />
                </>
              )}
            </div>
          </div>
          <div className={s.infoItem}>
            <p>ИНН</p>
            <div className={s.link}>
              {editing ? (
                <div className={s.editInput}>
                  <Input
                    disabled={true}
                    noMargin={true}
                    value={seller.inn}
                    onChange={() => {}}
                  />
                </div>
              ) : (
                <>
                  <h3>{seller.inn}</h3>
                  <ArrowLink />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        fields?.map((field, index) => (
          <div key={index} className={s.infoItem}>
            <p>{field.label}</p>
            <div className={`${s.link} ${field.disabled ? s.none : ''} ${field.hideArrow ? s.commission : ''}`}>
              {editing ? (
                <div className={s.editInput}>
                  <Input
                    disabled={field.disabled}
                    noMargin={true}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h3>{field.value}{field.suffix}</h3>
                  {!field.hideArrow && <ArrowLink />}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InfoCard; 