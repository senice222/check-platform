import React, { useState, useCallback, useEffect } from 'react';
import s from './sellers-section.module.scss';
import { Plus } from '../../../../components/svgs/svgs';
import Button from '../../../../components/ui/button/button';
import SellersTable from '../../../../components/tables/sellers-table/sellers-table';
import Select from '../../../../components/ui/select/select';
import { FilterButton } from '../../../../components/svgs/svgs';
import AddSellerModal from '../../../../components/modals/add-seller-modal/add-seller-modal';
import TypeFilterBottomSheet from '../../../../components/modals/type-filter-bottom-sheet/type-filter-bottom-sheet';
import DeleteUserModal from '../../../../components/modals/delete-user-modal/delete-user-modal';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { getAllSellers, createSeller, updateSeller, deleteSeller } from '../../../../store/slices/sellerSlice';
import { useNotification } from '../../../../contexts/NotificationContext/NotificationContext';

const SellersSection = () => {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  const { sellers, isLoading } = useAppSelector(state => state.seller);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedTypes, setSelectedTypes] = useState<('elite' | 'white')[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<any>(false);
  const [sellerToDelete, setSellerToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка продавцов при монтировании и изменении фильтров
  useEffect(() => {
    loadSellers();
  }, [selectedTypes, searchQuery]);

  const loadSellers = async () => {
    try {
      await dispatch(getAllSellers({
        types: selectedTypes,
        search: searchQuery
      })).unwrap();
    } catch (error: any) {
      addNotification(error.message || 'Ошибка при загрузке продавцов', 'error');
    }
  };

  const handleAddSeller = async (data: any) => {
    try {
      await dispatch(createSeller(data)).unwrap();
      addNotification('Продавец успешно добавлен', 'success');
      setIsAddSellerOpen(false);
    } catch (error: any) {
      addNotification(error.message || 'Ошибка при добавлении продавца', 'error');
    }
  };

  const handleUpdateSeller = async (data: any) => {
    try {
      await dispatch(updateSeller({
        id: isEditing.id,
        data
      })).unwrap();
      addNotification('Продавец успешно обновлен', 'success');
      setIsAddSellerOpen(false);
      setIsEditing(false);
    } catch (error: any) {
      addNotification(error.message || 'Ошибка при обновлении продавца', 'error');
    }
  };

  const handleDeleteSeller = async () => {
    console.log(sellerToDelete)
    if (!sellerToDelete) return;
    
    try {
        if (!sellerToDelete.id) {
            throw new Error('ID продавца не найден');
        }
        
        await dispatch(deleteSeller(sellerToDelete.id)).unwrap();
        addNotification('Продавец успешно удален', 'success');
        setSellerToDelete(null);
    } catch (error: any) {
        addNotification(error.message || 'Ошибка при удалении продавца', 'error');
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  };

  const mappedSellers = sellers.map(seller => ({
    ...seller,
    dateAdded: formatDate(seller.createdAt),
    telegram: seller.tg_link,
    applicationsCount: 0
  }));

  return (
    <div className={s.sellersSection}>
      <AddSellerModal 
        isOpened={isAddSellerOpen} 
        setOpen={setIsAddSellerOpen} 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSubmit={isEditing ? handleUpdateSeller : handleAddSeller}
      />
      
      <TypeFilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        options={typeOptions}
        onOptionChange={handleTypeChange}
      />

      <DeleteUserModal 
        isOpened={!!sellerToDelete}
        setOpen={() => setSellerToDelete(null)}
        name={sellerToDelete?.name || ''}
        customTexts={{
          title: `Вы уверены, что хотите удалить продавца ${sellerToDelete?.name}?`,
          description: 'Это действие необратимо. Все данные о продавце будут удалены.',
          buttonLabel: 'Удалить'
        }}
        customDelete={handleDeleteSeller}
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
        data={mappedSellers}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        openAddSellerModal={() => setIsAddSellerOpen(true)}
        setIsEditing={setIsEditing}
        onFilterOpen={() => setIsFilterOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onDeleteSeller={setSellerToDelete}
      />
    </div>
  );
};

export default SellersSection; 