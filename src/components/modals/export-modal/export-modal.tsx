import React, { FC, useState, useCallback, useEffect } from 'react';
import s from './export-modal.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import FilterBottomSheet from '../filter-bottom-sheet/filter-bottom-sheet';
import { FilterState } from '../../../types/filter-state';
import { Cross } from '../../svgs/svgs';
import StatusBadge from '../../ui/status-badge/status-badge';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import PreviewBottomSheet from '../preview-bottom-sheet/preview-bottom-sheet';
import { adminApi } from '../../../api/axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { ExportData, ExportResponse } from '../../../types/export';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    onExport: (type: 'table' | 'text', filters: FilterState) => void;
    data: any[];
    initialData: any[];
}

const ExportModal: FC<Props> = ({ 
    isOpened, 
    setOpen, 
    onExport,
    data,
    initialData,
}) => {
    const { companies, sellers } = useSelector((state: RootState) => state.selectors);
    const dispatch = useDispatch<AppDispatch>();
    const [exportType, setExportType] = useState<'table' | 'text'>('table');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterState>({
        date: { start: '', end: '' },
        users: [],
        companies: [],
        sellers: [],
        status: '',
        statuses: [],
        sum: { from: '', to: '' },
        search: ''
    });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState<ExportData[]>([]);

    useEffect(() => {
        if (!isOpened) {
            setPreviewData([]);
            setIsPreviewOpen(false);
            setIsFilterOpen(false);
        }
    }, [isOpened]);

    const handleExport = useCallback(async () => {
        try {
            const response = await adminApi.get<ExportResponse>('/applications/export', {
                params: {
                    clients: localFilters.users.map(user => user.id),
                    companies: localFilters.companies,
                    sellers: localFilters.sellers,
                    statuses: localFilters.status ? localFilters.status.split(',').filter(Boolean) : [],
                    dateStart: localFilters.date.start,
                    dateEnd: localFilters.date.end,
                    sumFrom: localFilters.sum?.from || '',
                    sumTo: localFilters.sum?.to || ''
                }
            });

            if (response?.data?.data) {
                if (exportType === 'table') {
                    // Форматируем данные для Excel
                    const formattedData = response.data.data.map(item => ({
                        'ID': item.id,
                        'Дата': item.date,
                        'Клиент': item.client,
                        'Компания': item.company,
                        'Продавец': item.seller,
                        'Сумма': item.sum,
                        'Статус': item.status
                    }));

                    const ws = XLSX.utils.json_to_sheet(formattedData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Заявки");
                    
                    // Устанавливаем ширину колонок
                    const colWidths = [
                        { wch: 10 }, // ID
                        { wch: 15 }, // Дата
                        { wch: 20 }, // Клиент
                        { wch: 20 }, // Компания
                        { wch: 20 }, // Продавец
                        { wch: 15 }, // Сумма
                        { wch: 15 }, // Статус
                    ];
                    ws['!cols'] = colWidths;

                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    saveAs(data, 'applications.xlsx');
                } else {
                    const textContent = response.data.data.map(item => (
                        `ID: ${item.id}
Дата: ${item.date}
Клиент: ${item.client}
Компания: ${item.company}
Продавец: ${item.seller}
Сумма: ${item.sum}
Статус: ${item.status}
----------------------------------------`
                    )).join('\n\n');

                    const data = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                    saveAs(data, 'applications.txt');
                }
                setOpen(false);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }, [exportType, localFilters, setOpen]);

    const handleDateChange = (start: string, end: string) => {
        setLocalFilters(prev => ({
            ...prev,
            date: { start, end }
        }));
    };

    const handleFiltersChange = (newFilters: FilterState) => {
        setLocalFilters(newFilters);
    };

    const handleSumChange = (from: number | null, to: number | null) => {
        setLocalFilters(prev => ({
            ...prev,
            sum: { 
                from: from?.toString() || '', 
                to: to?.toString() || '' 
            }
        }));
    };

    const handleRemoveFilter = (type: string, value?: string) => {
        setLocalFilters(prev => {
            const updated = { ...prev };
            switch (type) {
                case 'date':
                    updated.date = { start: '', end: '' };
                    break;
                case 'user':
                    updated.users = updated.users.filter(user => user.name !== value);
                    break;
                case 'company':
                    updated.companies = updated.companies.filter(company => company !== value);
                    break;
                case 'seller':
                    updated.sellers = updated.sellers.filter(seller => seller !== value);
                    break;
                case 'status':
                    updated.status = '';
                    updated.statuses = [];
                    break;
                case 'sum':
                    updated.sum = { from: '', to: '' };
                    break;
            }
            return updated;
        });
    };

    const getCompanyName = (companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        return company ? company.name : companyId;
    };

    const getSellerName = (sellerId: string) => {
        const seller = sellers.find(s => s.id === sellerId);
        return seller ? seller.name : sellerId;
    };

    const renderFilterTag = (label: string, value: string, type: string) => (
        <div key={`${type}-${value}`} className={s.filterTag}>
            <span className={s.filterLabel}>{label}:</span>
            <span className={s.filterValue}>{value}</span>
            <button 
                className={s.removeButton} 
                onClick={() => handleRemoveFilter(type, value)}
            >
                <Cross />
            </button>
        </div>
    );

    const renderFilterValue = (type: string, values: string[] | { start: string; end: string } | undefined, label: string) => {
        if (!values) return null;

        if (type === 'date') {
            const dateValues = values as { start: string; end: string };
            if (!dateValues.start || !dateValues.end) return null;
            return (
                <div className={s.filterTag}>
                    <span className={s.tagLabel}>{label}:</span>
                    {`${dateValues.start} - ${dateValues.end}`}
                </div>
            );
        }

        if (type === 'status' && localFilters.statuses.length > 0) {
            return (
                <div className={s.filterTag}>
                    <span className={s.tagLabel}>{label}:</span>
                    <StatusBadge statuses={localFilters.statuses} />
                </div>
            );
        }

        if (Array.isArray(values) && values.length > 0) {
            let displayValues = values;
            if (type === 'companies') {
                displayValues = values.map(getCompanyName);
            } else if (type === 'sellers') {
                displayValues = values.map(getSellerName);
            }
            
            return (
                <div className={s.filterTag}>
                    <span className={s.tagLabel}>{label}:</span>
                    {displayValues.join(', ')}
                </div>
            );
        }

        return null;
    };

    const renderAppliedFilters = () => {
        if (!localFilters) return null;

        const filterGroups = [
            { type: 'date', label: 'Дата', values: localFilters.date },
            { type: 'users', label: 'Клиент', values: localFilters.users.map(u => u.name) },
            { type: 'companies', label: 'Компания', values: localFilters.companies },
            { type: 'sellers', label: 'Продавец', values: localFilters.sellers },
            { type: 'status', label: 'Статус', values: localFilters.statuses },
            { 
                type: 'sum', 
                label: 'Сумма', 
                values: localFilters.sum?.from && localFilters.sum?.to 
                    ? [`${localFilters.sum.from} - ${localFilters.sum.to} ₽`] 
                    : undefined 
            }
        ];

        return (
            <div className={s.appliedFilters}>
                {filterGroups.map(group => {
                    const filterContent = renderFilterValue(group.type, group.values, group.label);
                    if (!filterContent) return null;
                    return filterContent;
                })}
            </div>
        );
    };

    const handlePreview = useCallback(async () => {
        try {
            const response = await adminApi.get('/applications/export', {
                params: {
                    clients: localFilters.users.map(user => user.id),
                    companies: localFilters.companies,
                    sellers: localFilters.sellers,
                    statuses: localFilters.status ? localFilters.status.split(',').filter(Boolean) : [],
                    dateStart: localFilters.date.start,
                    dateEnd: localFilters.date.end,
                    sumFrom: localFilters.sum?.from || '',
                    sumTo: localFilters.sum?.to || ''
                }
            });

            console.log('Preview response:', response.data);

            if (response?.data?.data) {
                setPreviewData(response.data.data);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            console.error('Error fetching preview data:', error);
        }
    }, [localFilters]);

    const handleClosePreview = useCallback(() => {
        setIsPreviewOpen(false);
    }, []);

    const handleSavePreview = useCallback(() => {
        if (previewData.length > 0) {
            if (exportType === 'table') {
                // Форматируем данные для Excel
                const formattedData = previewData.map(item => ({
                    'ID': item.id,
                    'Дата': item.date,
                    'Клиент': item.client,
                    'Компания': item.company,
                    'Продавец': item.seller,
                    'Сумма': item.sum,
                    'Статус': item.status
                }));

                const ws = XLSX.utils.json_to_sheet(formattedData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Заявки");
                
                // Устанавливаем ширину колонок
                const colWidths = [
                    { wch: 10 }, // ID
                    { wch: 15 }, // Дата
                    { wch: 20 }, // Клиент
                    { wch: 20 }, // Компания
                    { wch: 20 }, // Продавец
                    { wch: 15 }, // Сумма
                    { wch: 15 }, // Статус
                ];
                ws['!cols'] = colWidths;

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(data, 'applications.xlsx');
            } else {
                const textContent = previewData.map(item => (
                    `ID: ${item.id}
Дата: ${item.date}
Клиент: ${item.client}
Компания: ${item.company}
Продавец: ${item.seller}
Сумма: ${item.sum}
Статус: ${item.status}
----------------------------------------`
                )).join('\n\n');

                const data = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                saveAs(data, 'applications.txt');
            }
        }
        
        setIsPreviewOpen(false);
        setOpen(false);
    }, [exportType, previewData, setOpen]);

    useEffect(() => {
        if (isPreviewOpen) {
            console.log('Preview data:', previewData);
        }
    }, [isPreviewOpen, previewData]);

    return (
        <>
            <Modal
                title="Экспорт"
                setOpen={setOpen}
                isOpened={isOpened}
            >
                <div className={s.content}>
                    <div className={s.typeLabel}>Тип экспорта</div>
                    <div className={s.typeSelector}>
                        <button
                            className={`${s.typeOption} ${exportType === 'table' ? s.active : ''}`}
                            onClick={() => setExportType('table')}
                        >
                            Таблица
                        </button>
                        <button
                            className={`${s.typeOption} ${exportType === 'text' ? s.active : ''}`}
                            onClick={() => setExportType('text')}
                        >
                            Текст
                        </button>
                    </div>

                    <div className={s.filterSection}>
                        <div className={s.typeLabel}>Экспорт по фильтрам</div>
                        <button 
                            className={s.filterButton}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Открыть меню фильтрации
                        </button>
                        {renderAppliedFilters()}
                    </div>
                </div>
                <div className={s.actions}>
                    <Button
                        label="Предпросмотр"
                        variant="preview"
                        onClick={handlePreview}
                        style={{ width: "100%", height: "40px", backgroundColor: '#0A0F290A' }}
                        styleLabel={{ fontSize: "14px", fontWeight: "500", color: "#14151A" }}
                    />
                    <Button
                        label="Экспортировать"
                        variant="purple"
                        onClick={handleExport}
                        style={{ width: "100%", height: "40px" }}
                        styleLabel={{ fontSize: "14px", fontWeight: "500" }}
                    />
                    <Button
                        label="Отмена"
                        variant="white"
                        onClick={() => setOpen(false)}
                        style={{ width: "100%", height: "40px" }}
                        styleLabel={{ fontSize: "14px", fontWeight: "500" }}
                    />
                </div>
            </Modal>

            <FilterBottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={localFilters}
                onFiltersChange={handleFiltersChange}
                data={data}
                initialData={initialData}
                onDateChange={handleDateChange}
                onSumChange={handleSumChange}
                hideClientFilter={false}
                hideCompanyFilter={false}
                hideStatusFilter={false}
                useMobileView={true}
            />

            <PreviewBottomSheet
                isOpen={isPreviewOpen}
                onClose={handleClosePreview}
                type={exportType}
                data={previewData}
                previewType='applications'
                filters={localFilters}
                onSave={handleSavePreview}
            />
        </>
    );
};

export default ExportModal; 