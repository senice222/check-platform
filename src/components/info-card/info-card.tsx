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
  company?: Company;
  companies?: Company[];
  onCompanyChange?: (company: Company) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  editing,
  fields,
  isCustomSelect,
  company,
  companies,
  onCompanyChange
}) => {
  return (
    <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
      <h2>{title}</h2>
      {isCustomSelect && company && companies && onCompanyChange ? (
        <>
          <div className={s.infoItem}>
            <p>Компания</p>
            <div className={`${s.link} ${company.type === 'elit' ? s.elit : ''}`}>
              {editing ? (
                <CustomSelect
                  companies={companies}
                  defaultValue={company}
                  onChange={onCompanyChange}
                />
              ) : (
                <>
                  <h3>{company.name}</h3>
                  {company.type === "elit" && <div className={s.elitMark}>Элитная</div>}
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
                    value={company.inn}
                    onChange={() => {}}
                  />
                </div>
              ) : (
                <>
                  <h3>{company.inn}</h3>
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