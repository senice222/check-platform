import React, { useRef, useState, useEffect, useMemo } from 'react';
import styles from './applications-search-bottom-sheet.module.scss';
import { SearchIcon, SearchIcon2 } from '../../svgs/svgs';
import { useNavigate } from 'react-router-dom';
import { TableData } from '../../active-applications/active-applications';
import StatusBadge from '../../ui/status-badge/status-badge';
import { ClientIcon } from '../../svgs/svgs';

interface ApplicationsSearchBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    applications: TableData[];
}

const ApplicationsSearchBottomSheet: React.FC<ApplicationsSearchBottomSheetProps> = ({
    isOpen,
    onClose,
    searchQuery,
    onSearchChange,
    applications
}) => {
    const navigate = useNavigate();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const sheetRef = useRef<HTMLDivElement>(null);
    const [startY, setStartY] = useState<number>(0);
    const [currentY, setCurrentY] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
        } else {
            handleClose();
        }
    }, [isOpen]);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleClose = () => {
        setIsClosing(true);
        onClose();
        setIsVisible(false);
        setIsClosing(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff < 0) return;
        setCurrentY(diff);
        if (sheetRef.current) {
            sheetRef.current.style.transform = `translateY(${diff}px)`;
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentY > 100) {
            handleClose();
        }
        if (sheetRef.current) {
            sheetRef.current.style.transform = 'translateY(0)';
        }
        setCurrentY(0);
    };

    const handleLocalSearchChange = (value: string) => {
        setLocalSearchQuery(value);
        onSearchChange(value);
    };

    const filteredApplications = useMemo(() => {
        if (!localSearchQuery) return [];
        
        const query = localSearchQuery.toLowerCase();
        
        return applications.filter(item =>
            (item.id?.toString() || '').toLowerCase().includes(query) ||
            (item.user?.name || '').toLowerCase().includes(query) ||
            (item.company?.name || '').toLowerCase().includes(query)
        );
    }, [localSearchQuery, applications]);

    const renderCard = (application: TableData, index: number) => (
        <div className={styles.card} key={application.id} 
             onClick={() => navigate(`/admin/application/${application.id}`)}>
            <div className={styles.cardHeader}>
                <div className={styles.topElement}>
                    <span className={styles.cardId}>№{index + 1}</span>
                    <div className={styles.statuses}>
                        {application.status.map((status, i) => (
                            <StatusBadge key={i} status={status} />
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.buyerSellerRow}>
                    <div className={styles.buyerBlock}>
                        <span className={styles.cardLabel}>Покупатель</span>
                        <span className={styles.companyName}>{application.company.name}</span>
                        <span className={styles.inn}>ИНН {application.user.inn}</span>
                    </div>
                    <div className={styles.sellerBlock}>
                        <span className={styles.cardLabel}>Продавец</span>
                        <span className={styles.sellerName}>{application.seller.name}</span>
                        <span className={styles.inn}>ИНН {application.seller.inn}</span>
                    </div>
                </div>
                <div className={styles.dateChecksRow}>
                    <span className={styles.date}>{`${application.date.start} → ${application.date.end}`}</span>
                    <span className={styles.checksCount}>{application.checksCount} чеков</span>
                </div>
                <div className={styles.userSumRow}>
                    <div className={styles.userBlock}>
                        <ClientIcon />
                        <span className={styles.userName}>{application.user.name}</span>
                    </div>
                    <div className={styles.sumBlock}>
                        <span className={styles.sumLabel}>Сумма:</span>
                        <span className={styles.sumValue}>{application.totalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEmptyState = () => {
        if (!localSearchQuery) {
            return (
                <div className={styles.emptyState}>
                    <SearchIcon2 />
                    <span>Это поиск заявок</span>
                    <span className={styles.hint}>Здесь можно искать заявки по номеру или имени клиента.</span>
                </div>
            );
        }

        if (localSearchQuery && filteredApplications.length === 0) {
            return (
                <div className={styles.emptyState}>
                    <SearchIcon2 />
                    <span>Ничего не найдено</span>
                    <span className={styles.hint}>Заявок с такими параметрами нет. Проверьте ваш запрос.</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
            <div className={`${styles.overlay} ${isClosing ? styles.closing2 : ''}`} onClick={handleClose}>
                <div
                    ref={sheetRef}
                    className={`${styles.sheet} ${isClosing ? styles.closing : ''}`}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        <div className={styles.dragIndicator} />
                        <div className={styles.headerContent}>
                            <h2>Поиск</h2>
                            <button onClick={handleClose}>Закрыть</button>
                        </div>
                        <div className={styles.searchWrapper}>
                            <span className={styles.icon}>
                                <SearchIcon />
                            </span>
                            <input
                                className={styles.search}
                                type="text"
                                placeholder="Поиск"
                                value={localSearchQuery}
                                onChange={(e) => handleLocalSearchChange(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className={styles.results}>
                        {renderEmptyState()}
                        {localSearchQuery && filteredApplications.length > 0 && 
                            filteredApplications.map((application, index) => renderCard(application, index))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsSearchBottomSheet; 