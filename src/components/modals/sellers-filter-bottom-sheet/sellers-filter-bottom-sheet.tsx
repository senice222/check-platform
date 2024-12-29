import React, { FC } from 'react';
import s from './sellers-filter-bottom-sheet.module.scss';
import Modal from '../../ui/modal/modal';
import CheckBox from '../../ui/check-box/check-box';
import Button from '../../ui/button/button';

type CompanyType = 'elite' | 'white';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  setTypes?: (types: CompanyType[]) => void;
  selectedTypes?: CompanyType[];
}

const SellersFilterBottomSheet: FC<Props> = ({ 
  isOpened, 
  setOpen, 
  setTypes: setFinalTypes, 
  selectedTypes: initialTypes 
}) => {
  const allTypes: CompanyType[] = ['elite', 'white'];
  const [types, setTypes] = React.useState<CompanyType[]>(initialTypes || []);

  const handleClick = (type: CompanyType) => {
    if (types.includes(type)) {
      setTypes(types.filter((t) => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const handleSave = () => {
    setFinalTypes?.(types);
    setOpen(false);
  };

  const getTypeLabel = (type: CompanyType) => {
    return type === 'elite' ? 'Элитная' : 'Белая';
  };
  
  return (
    <Modal 
      title='Тип компании' 
      setOpen={setOpen} 
      isOpened={isOpened}
    >
      <div className={s.content}>
        <div className={s.typeList}>
          {allTypes.map((type) => (
            <div
              key={type}
              onClick={() => handleClick(type)}
              className={s.typeItem}
            >
              <CheckBox
                isChecked={types.includes(type)}
                setChecked={() => handleClick(type)}
              />
              <span className={`${s.typeBadge} ${s[type]}`}>
                {getTypeLabel(type)}
              </span>
            </div>
          ))}
        </div>
        
        <div className={s.actions}>
          <Button 
            style={{width: '100%', height: '46px'}} 
            styleLabel={{fontSize: '14px', fontWeight: '500'}} 
            variant='purple' 
            label='Сохранить' 
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SellersFilterBottomSheet; 