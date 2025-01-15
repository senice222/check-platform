import React, { FC, useState, useCallback, useEffect } from 'react';
import s from './export-checks-modal.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';
import FilterBottomSheet from '../filter-bottom-sheet/filter-bottom-sheet';
import PreviewBottomSheet from '../preview-bottom-sheet/preview-bottom-sheet';
import { FilterState } from '../../../types/filter-state';
import { adminApi } from '../../../api/axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Cross } from '../../svgs/svgs';
import StatusBadge from '../../ui/status-badge/status-badge';

interface Props {
    isOpened: boolean;
    setOpen: (isOpen: boolean) => void;
    data: any[];
    initialData: any[];
}

const ExportChecksModal: FC<Props> = ({ 
    isOpened, 
    setOpen, 
    data,
    initialData,
}) => {
    const [exportType, setExportType] = useState<'table' | 'text'>('table');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [localFilters, setLocalFilters] = useState<FilterState>({
        date: { start: '', end: '' },
        companies: [],
        sellers: [],
        sum: { from: '', to: '' },
        search: ''
    });

    useEffect(() => {
        if (!isOpened) {
            setPreviewData([]);
            setIsPreviewOpen(false);
            setIsFilterOpen(false);
        }
    }, [isOpened]);

    const handlePreview = useCallback(async () => {
        try {
            const response = await adminApi.get('/checks/export', {
                params: {
                    companies: localFilters.companies,
                    sellers: localFilters.sellers,
                    dateStart: localFilters.date.start,
                    dateEnd: localFilters.date.end,
                    sumFrom: localFilters.sum?.from || '',
                    sumTo: localFilters.sum?.to || ''
                }
            });

            if (response?.data?.data) {
                setPreviewData(response.data.data);
                setIsPreviewOpen(true);
            }
        } catch (error) {
            console.error('Error fetching preview data:', error);
        }
    }, [localFilters]);

    const handleExport = useCallback(async () => {
        try {
            const response = await adminApi.get('/checks/export', {
                params: {
                    companies: localFilters.companies,
                    sellers: localFilters.sellers,
                    dateStart: localFilters.date.start,
                    dateEnd: localFilters.date.end,
                    sumFrom: localFilters.sum?.from || '',
                    sumTo: localFilters.sum?.to || ''
                }
            });

            if (response?.data?.data) {
                if (exportType === 'table') {
                    const formattedData = response.data.data.map(item => ({
                        'ID': item.id,
                        'Дата': item.date,
                        'Компания': item.company,
                        'Продавец': item.seller,
                        'Товар': item.product,
                        'Количество': item.quantity,
                        'Цена за единицу': item.pricePerUnit,
                        'Общая сумма': item.totalPrice,
                        'НДС': item.vat
                    }));

                    const ws = XLSX.utils.json_to_sheet(formattedData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Чеки");
                    
                    const colWidths = [
                        { wch: 10 }, // ID
                        { wch: 15 }, // Дата
                        { wch: 20 }, // Компания
                        { wch: 20 }, // Продавец
                        { wch: 30 }, // Товар
                        { wch: 15 }, // Количество
                        { wch: 15 }, // Цена за единицу
                        { wch: 15 }, // Общая сумма
                        { wch: 15 }, // НДС
                    ];
                    ws['!cols'] = colWidths;

                    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    saveAs(data, 'checks.xlsx');
                } else {
                    const textContent = response.data.data.map(item => (
                        `ID: ${item.id}
Дата: ${item.date}
Компания: ${item.company}
Продавец: ${item.seller}
Товар: ${item.product}
Количество: ${item.quantity}
Цена за единицу: ${item.pricePerUnit}
Общая сумма: ${item.totalPrice}
НДС: ${item.vat}
----------------------------------------`
                    )).join('\n\n');

                    const data = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                    saveAs(data, 'checks.txt');
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

    const renderAppliedFilters = () => {
        const appliedFilters = [];

        if (localFilters.date.start || localFilters.date.end) {
            appliedFilters.push(
                <div key="date" className={s.filterTag}>
                    <span>
                        {localFilters.date.start && localFilters.date.end
                            ? `${localFilters.date.start} - ${localFilters.date.end}`
                            : localFilters.date.start || localFilters.date.end}
                    </span>
                    <button onClick={() => handleDateChange('', '')}>
                        <Cross />
                    </button>
                </div>
            );
        }

        if (localFilters.sum.from || localFilters.sum.to) {
            appliedFilters.push(
                <div key="sum" className={s.filterTag}>
                    <span>
                        {localFilters.sum.from && localFilters.sum.to
                            ? `${localFilters.sum.from}₽ - ${localFilters.sum.to}₽`
                            : (localFilters.sum.from && `от ${localFilters.sum.from}₽`) || 
                              (localFilters.sum.to && `до ${localFilters.sum.to}₽`)}
                    </span>
                    <button onClick={() => handleSumChange(null, null)}>
                        <Cross />
                    </button>
                </div>
            );
        }

        return appliedFilters.length > 0 && (
            <div className={s.appliedFilters}>
                <div className={s.filterTags}>{appliedFilters}</div>
            </div>
        );
    };

    return (
        <>
            <Modal
                title="Экспорт чеков"
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
                hideClientFilter={true}
                hideStatusFilter={true}
                useMobileView={true}
            />

            <PreviewBottomSheet
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                type={exportType}
                data={previewData}
                filters={localFilters}
                onSave={handleExport}
                previewType='checks'
            />
        </>
    );
};

export default ExportChecksModal; 