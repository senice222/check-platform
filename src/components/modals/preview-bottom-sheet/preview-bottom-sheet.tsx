import React, { useRef, useState, useEffect } from 'react';
import styles from './preview-bottom-sheet.module.scss';
import { FilterState } from '../../../types/filter-state';
import { ExportData } from '../../../types/export';
import StatusBadge from '../../ui/status-badge/status-badge';

interface PreviewBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'table' | 'text';
    data: ExportData[];
    filters: FilterState;
    onSave: () => void;
    previewType?: 'checks' | 'applications';
}

const PreviewBottomSheet: React.FC<PreviewBottomSheetProps> = ({
    isOpen,
    onClose,
    type,
    data,
    filters,
    onSave,
    previewType = 'checks'
}) => {
    // console.log('PreviewBottomSheet props:', { isOpen, type, data });

    const sheetRef = useRef<HTMLDivElement>(null);
    const [startY, setStartY] = useState<number>(0);
    const [currentY, setCurrentY] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsClosing(true);
            timeoutId = setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
                setCurrentY(0);
            }, 300);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isOpen]);

    // Копируем логику свайпов из FilterBottomSheet
    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
            setCurrentY(diff);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (currentY > 150) {
            handleClose();
        } else {
            setCurrentY(0);
        }
    };

    const handleClose = () => {
        onClose();
    };
    // console.log('data', data);
    const renderContent = () => {
        if (type === 'table') {
            return (
                <div className={styles.tablePreview}>
                    <table>
                        <thead>
                            <tr>
                                {previewType === 'checks' ? (
                                    <>
                                        <th>ID</th>
                                        <th>Дата</th>
                                        <th>Компания</th>
                                        <th>Продавец</th>
                                        <th>Товар</th>
                                        <th>Количество</th>
                                        <th>Цена за ед.</th>
                                        <th>Сумма</th>
                                        <th>НДС</th>
                                    </>
                                ) : (
                                    <>
                                        <th>ID</th>
                                        <th>Дата</th>
                                        <th>Клиент</th>
                                        <th>Компания</th>
                                        <th>Продавец</th>
                                        <th>Сумма</th>
                                        <th>Статус</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.id}>
                                    {previewType === 'checks' ? (
                                        <>
                                            <td>{row.id}</td>
                                            <td>{row.date}</td>
                                            <td>{row.company}</td>
                                            <td>{row.seller}</td>
                                            <td>{row.product}</td>
                                            <td>{row.quantity}</td>
                                            <td>{row.pricePerUnit}</td>
                                            <td>{row.totalPrice}</td>
                                            <td>{row.vat}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{row.id}</td>
                                            <td>{row.date}</td>
                                            <td>{row.client}</td>
                                            <td>{row.company}</td>
                                            <td>{row.seller}</td>
                                            <td>{row.sum}</td>
                                            <td>
                                                {row.status}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className={styles.textPreview}>
                {data.map((row) => (
                    <div key={row.id} className={styles.textRow}>
                        {previewType === 'checks' ? (
                            `ID: ${row.id}
Дата: ${row.date}
Компания: ${row.company}
Продавец: ${row.seller}
Товар: ${row.product}
Количество: ${row.quantity}
Цена за единицу: ${row.pricePerUnit}
Общая сумма: ${row.totalPrice}
НДС: ${row.vat}
`
                        ) : (
                            `ID: ${row.id}
Дата: ${row.date}
Клиент: ${row.client}
Компания: ${row.company}
Продавец: ${row.seller}
Сумма: ${row.sum}
Статус: ${row.status}
`
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
            <div 
                className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} 
                onClick={handleClose}
            >
                <div 
                    ref={sheetRef}
                    className={`${styles.sheet} ${isVisible ? styles.visible : ''}`}
                    style={{ transform: `translateY(${currentY}px)` }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.dragArea}>
                        <div className={styles.dragIndicator} />
                        <div className={styles.header}>
                            <h2>Предпросмотр</h2>
                            <button onClick={handleClose}>Закрыть</button>
                        </div>
                    </div>

                    <div className={styles.content}>
                        {renderContent()}
                    </div>

                    <div className={styles.footer}>
                        <button onClick={onSave} className={styles.saveButton}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewBottomSheet; 