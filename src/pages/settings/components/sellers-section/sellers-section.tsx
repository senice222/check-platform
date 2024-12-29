import React, { useState, useCallback } from 'react';
import s from './sellers-section.module.scss';
import { Plus } from '../../../../components/svgs/svgs';
import Button from '../../../../components/ui/button/button';
import SellersTable from '../../../../components/tables/sellers-table/sellers-table';
import Select from '../../../../components/ui/select/select';
import { FilterButton } from '../../../../components/svgs/svgs';
import AddSellerModal from '../../../../components/modals/add-seller-modal/add-seller-modal';
import TypeFilterBottomSheet from '../../../../components/modals/type-filter-bottom-sheet/type-filter-bottom-sheet';
import { mockData } from '../../mock-data';

const SellersSection = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedTypes, setSelectedTypes] = useState<('elite' | 'white')[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<typeof mockData[0] | false>(false);

  const typeOptions = [
    { 
      id: 'elite', 
      label: 'Элитная', 
      checked: selectedTypes.includes('elite') 
    },
    { 
      id: 'white', 
      label: 'Белая', 
      checked: selectedTypes.includes('white') 
    }
  ];

  const handleTypeChange = (newOptions: { id: string; label: string; checked: boolean }[]) => {
    setSelectedTypes(newOptions.filter(opt => opt.checked).map(opt => opt.id) as ('elite' | 'white')[]);
  };

  return (
    <div className={s.sellersSection}>
      <AddSellerModal 
        isOpened={isAddSellerOpen} 
        setOpen={setIsAddSellerOpen} 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      
      <TypeFilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        options={typeOptions}
        onOptionChange={handleTypeChange}
      />
      
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.titleBlock}>
            <h2 className={s.headerTitle}>Продавцы</h2>
            <div className={s.desktopFilter}>
              <Select
                icon={<FilterButton />}
                label="По типу"
                type="type"
                options={typeOptions}
                onOptionChange={handleTypeChange}
              />
            </div>
          </div>
        </div>
        <Button 
          label='Добавить продавца' 
          icon={<Plus />} 
          onClick={() => {
            setIsAddSellerOpen(true);
            setIsEditing(false);
          }}
          styleLabel={{fontSize: '14px'}} 
          style={{width: "183px", height: "32px"}}
        />
      </div>

      <SellersTable 
        data={mockData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        openAddSellerModal={() => setIsAddSellerOpen(true)}
        setIsEditing={setIsEditing}
        onFilterOpen={() => setIsFilterOpen(true)}
      />
    </div>
  );
};

export default SellersSection; 