import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { 
  fetchApplicationDetails, 
  updateApplicationStatus,
  updateApplicationInfo,
  updateApplicationStatusOnly,
  fetchApplicationHistory 
} from "../../store/slices/applicationSlice";
import { getAllSellers } from "../../store/slices/sellerSlice";
import { useNotification } from "../../contexts/NotificationContext/NotificationContext";
import { Company, ApplicationInfo } from "../../types/company.types";
import { companies } from "../../constants/companies";
import { Plus } from "../../components/svgs/svgs";
import PageTitle from "../../components/ui/page-title/page-title";
import ChecksTable from "../../components/tables/checks-table/ckecks-table";
import IsEditingBar from "../../components/is-editing-bar/is-editing-bar";
import Comments from "../../components/comments/comments";
import InfoCard from "../../components/info-card/info-card";
import ChecksInfo from "../../components/checks-info/checks-info";
import { ApplicationStatus } from "../../constants/statuses";
import s from "./application-detailed.module.scss";
import HistoryTable from "../../components/tables/history-table/history-table";
import SellerSelect from "../../components/ui/seller-select/seller-select";
import AddCheckModal from "../../components/modals/add-check-modal/add-check-modal";

const INITIAL_APPLICATION_INFO: ApplicationInfo = {
  seller: {
    companyName: "ООО \"КОМПАНИЯ 1\"",
    inn: "134841293138"
  },
  buyer: companies[0],
  commission: {
    percentage: "10",
    amount: "0"
  }
};

// Обновляем интерфейс TempChanges
interface TempChanges {
  seller?: {
    id?: string;
    name?: string;
    inn?: string;
  };
  buyer?: {
    name?: string;
    inn?: string;
  };
  commission?: {
    percentage?: string;
    amount?: string;
  };
  checksToDelete?: string[];
  checksToAdd?: Array<{
    date: string;
    product: string;
    quantity: number;
    pricePerUnit: number;
    unit: string;
    totalPrice: number;
  }>;
}

// Обновляем интерфейс для чека в соответствии с ожиданиями модального окна
interface NewCheck {
  date: string;
  product: string;
  unit: string;
  quantity: number;
  priceWithVAT: string; // Изменено с pricePerUnit
  totalWithVAT: string; // Изменено с totalPrice
  vat20: string;        // Добавлено для НДС
}

const ApplicationDetailed: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  const { currentApplication, isLoading, history, historyLoading } = useAppSelector(state => state.application);
  const { sellers } = useAppSelector(state => state.seller);
  console.log(currentApplication);
  
  const [editing, setEditing] = useState(false);
  const [tempChanges, setTempChanges] = useState<TempChanges>({});
  const [isAddCheckModalOpen, setIsAddCheckModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationDetails(id));
      dispatch(fetchApplicationHistory(id));
    }
    dispatch(getAllSellers({}));
  }, [id, dispatch]);

  // Обработчик изменения статусов
  const handleStatusChange = async (newStatuses: ApplicationStatus[]) => {
    if (!id) return;
    
    try {
        const result = await dispatch(updateApplicationStatusOnly({ 
            applicationId: id, 
            statuses: newStatuses 
        })).unwrap();
        
        // Проверяем, что статус действительно обновился
        if (result.status) {
            // addNotification('Статус заявки обновлен', 'success');
            dispatch(fetchApplicationHistory(id));
        }
    } catch (error: any) {
        addNotification(error.message || 'Ошибка при обновлении статуса', 'error');
    }
  };

  // Обновляем обработчик изменения продавца
  const handleSellerChange = (sellerId: string, sellerInn: string) => {
    const selectedSeller = sellers.find(s => s.id === sellerId);
    if (selectedSeller) {
      setTempChanges(prev => ({
        ...prev,
        seller: {
          id: sellerId,
          name: selectedSeller.name,
          inn: sellerInn
        }
      }));
    }
  };

  // Обновляем обработчик изменения покупателя
  const handleBuyerChange = (field: string, value: string) => {
    setTempChanges(prev => ({
        ...prev,
        buyer: {
            name: currentApplication?.company?.name || '',  // Всегда сохраняем текущее имя
            inn: currentApplication?.company?.inn || '',    // Всегда сохраняем текущий ИНН
            ...prev.buyer,                                 // Предыдущие изменения
            [field]: value                                // Новое значение
        }
    }));
  };

  // Обработчик временного изменения комиссии
  const handleCommissionChange = (percentage: string) => {
    if (!currentApplication) return;
    
    setTempChanges(prev => ({
      ...prev,
      commission: {
        percentage,
        amount: String(Number(currentApplication.totalAmount) * Number(percentage) / 100)
      }
    }));
  };

  // Добавляем обработчик удаления чека
  const handleCheckDelete = (checkId: string) => {
    // Проверяем, является ли чек временным (новым)
    if (checkId.startsWith('temp_')) {
      // Удаляем из временно добавленных чеков
      setTempChanges(prev => ({
        ...prev,
        checksToAdd: (prev.checksToAdd || []).filter((_, index) => `temp_${index}` !== checkId)
      }));
    } else {
      // Добавляем в список на удаление существующий чек
      setTempChanges(prev => ({
        ...prev,
        checksToDelete: [...(prev.checksToDelete || []), checkId]
      }));
    }
  };

  // Сохранение всех изменений
  const handleSaveChanges = async () => {
    if (!id) return;

    try {
      if (Object.keys(tempChanges).length > 0) {
        const updateData = {
          buyer: tempChanges.buyer ? {
            name: tempChanges.buyer.name || currentApplication?.company?.name,
            inn: tempChanges.buyer.inn || currentApplication?.company?.inn
          } : undefined,
          seller: tempChanges.seller ? {
            id: tempChanges.seller.id,
            name: tempChanges.seller.name,
            inn: tempChanges.seller.inn
          } : undefined,
          commission: tempChanges.commission ? {
            percentage: tempChanges.commission.percentage,
            amount: tempChanges.commission.amount
          } : undefined,
          checksToDelete: tempChanges.checksToDelete || [],
          checksToAdd: tempChanges.checksToAdd || []
        };

        await dispatch(updateApplicationInfo({
          applicationId: id,
          data: updateData
        })).unwrap();
        
        addNotification('Изменения сохранены', 'success');
        
        await dispatch(fetchApplicationDetails(id));
        await dispatch(fetchApplicationHistory(id));
        
        setEditing(false);
        setTempChanges({});
        setIsAddCheckModalOpen(false);
      }
    } catch (err: any) {
      console.error('Update error:', err);
      const errorMessage = typeof err === 'string' ? err : 
        err.message || 'Неизвестная ошибка при сохранении';
      addNotification(errorMessage, 'error');
    }
  };

  // Отмена изменений
  const handleCancelEditing = () => {
    setEditing(false);
    setTempChanges({}); // Сбрасываем все временные изменения
    setIsCreating(false); // Если есть состояние для создания чеков
  };

  // Добавим форматирование commission при отображении
  const formattedCommission = useMemo(() => {
    if (!currentApplication) return { percentage: '0', amount: '0' };
    
    return {
        percentage: currentApplication.commission.toString(),
        amount: ((Number(currentApplication.totalAmount) * currentApplication.commission) / 100).toFixed(2)
    };
  }, [currentApplication]);

  const handleAddCheck = (checkData: NewCheck) => {
    // Функция для правильного парсинга числа в русском формате
    const parseRussianNumber = (str: string): number => {
      // Убираем пробелы и заменяем запятую на точку
      return parseFloat(str.replace(/\s/g, '').replace(',', '.'));
    };

    const newCheck = {
      date: new Date(checkData.date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).replace(/\./g, '/'),
      product: checkData.product,
      unit: checkData.unit,
      quantity: checkData.quantity,
      pricePerUnit: parseRussianNumber(checkData.priceWithVAT),
      totalPrice: parseRussianNumber(checkData.totalWithVAT)
    };

    console.log(newCheck, 12);
    setTempChanges(prev => ({
      ...prev,
      checksToAdd: [...(prev.checksToAdd || []), newCheck]
    }));
    setIsAddCheckModalOpen(false);
  };

  if (isLoading || !currentApplication) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={s.applicationDetailed}>
      <IsEditingBar isEditing={editing} desktop={true} />
      <PageTitle
        title={`Заявка #${currentApplication?.id?.slice(0, 7) || ''}`}
        statuses={currentApplication?.status}
        setStatuses={handleStatusChange}
        name={currentApplication?.user?.name || ''}
        editing={editing}
        setEditing={setEditing}
        onSave={handleSaveChanges}
        onCancel={handleCancelEditing}
        date={currentApplication?.dates?.start}
      />
      <Comments editing={editing} applicationId={id || ''} />

      <div className={s.applicationInfo}>
        <h1 className={s.title}>Информация о заявке</h1>
        <div className={s.infoList}>
          <InfoCard
            title="ПОКУПАТЕЛЬ"
            editing={editing}
            fields={[
              {
                label: "Компания",
                value: tempChanges.buyer?.name ?? currentApplication.company?.name ?? '',
                onChange: (value) => handleBuyerChange('name', value)
              },
              {
                label: "ИНН",
                value: tempChanges.buyer?.inn ?? currentApplication.company?.inn ?? '',
                onChange: (value) => handleBuyerChange('inn', value)
              }
            ]}
          />

          <InfoCard
            title="ПРОДАВЕЦ"
            editing={editing}
            isCustomSelect={true}
            seller={{
              id: tempChanges.seller?.id ?? currentApplication.seller?.id ?? '',
              name: tempChanges.seller?.name ?? currentApplication.seller?.name ?? '',
              inn: tempChanges.seller?.inn ?? currentApplication.seller?.inn ?? ''
            }}
            sellers={sellers}
            onSellerChange={handleSellerChange}
          />

          <InfoCard
            title="КОМИССИЯ"
            editing={editing}
            fields={[
              {
                label: "Процент комиссии",
                value: tempChanges.commission?.percentage ?? formattedCommission.percentage,
                onChange: handleCommissionChange,
                suffix: "%",
                hideArrow: true
              },
              {
                label: "Сумма комиссии",
                value: tempChanges.commission?.amount ?? formattedCommission.amount,
                disabled: true,
                onChange: () => {},
                hideArrow: true
              }
            ]}
          />
        </div>
      </div>

      <ChecksInfo
        dates={currentApplication?.dates ? 
            `${currentApplication.dates.start || ''} → ${currentApplication.dates.end || ''}` : 
            ''}
        checksCount={currentApplication?.checksCount || 0}
        sumWithVat={currentApplication?.totalAmount || '0'}
        vat={currentApplication?.vat || '0'}
      />

      <div className={s.checksTable}>
        <ChecksTable 
          data={[
            ...(currentApplication.checks || []).filter(
              check => !tempChanges.checksToDelete?.includes(check.id)
            ),
            ...(tempChanges.checksToAdd || []).map((check, index) => ({
              ...check,
              id: `temp_${index}`,
              _id: `temp_${index}`
            }))
          ]} 
          onDelete={editing ? handleCheckDelete : undefined}
          onAddCheck={editing ? () => setIsAddCheckModalOpen(true) : undefined}
          isApplicationMode={true}
          showAddButton={editing}
        />
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>История изменений</h2>
        <HistoryTable 
          history={history} 
          isLoading={historyLoading} 
        />
      </div>

        <AddCheckModal
          isOpened={isAddCheckModalOpen}
          setOpen={setIsAddCheckModalOpen}
          onSubmit={handleAddCheck}
        />

    </div>
  );
};

export default ApplicationDetailed;
