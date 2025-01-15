import { useState, useEffect } from "react";
import styles from "./ckecks-table.module.scss";
import { Calendar, TableIcon, CardIcon, EditSvg as EditIcon, Trash as Cross, Plus, DownloadSvg } from '../../svgs/svgs';
import ChecksInfo from '../../checks-info/checks-info';
import Button from "../../ui/button/button";
interface CheckRow {
  _id?: string;
  id: string;
  date: string;
  product: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface ChecksTableProps {
  hasChecks?: boolean;
  showTotal?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  data?: CheckRow[];
  onViewModeChange?: (mode: 'table' | 'cards') => void;
  hideTitle?: boolean;
  hideChecksInfo?: boolean;
  onAddCheck?: () => void;
  showAddButton?: boolean;
  isApplicationMode?: boolean;
}

const mockData: CheckRow[] = [
  { 
    _id: "507f1f77bcf86cd799439011",
    id: "#1", 
    date: "25/10/24", 
    product: "Товар 1", 
    unit: "шт.", 
    quantity: 1000, 
    pricePerUnit: 91.316, 
    totalPrice: 91.316 
  },
  { 
    _id: "507f1f77bcf86cd799439012",
    id: "#2", 
    date: "25/10/24", 
    product: "Товар 2", 
    unit: "шт.", 
    quantity: 500, 
    pricePerUnit: 45.658, 
    totalPrice: 22.829 
  },
  { 
    _id: "507f1f77bcf86cd799439013",
    id: "#3", 
    date: "25/10/24", 
    product: "Товар 3", 
    unit: "шт.", 
    quantity: 750, 
    pricePerUnit: 68.487, 
    totalPrice: 51.365 
  }
];

const ChecksTable: React.FC<ChecksTableProps> = ({ 
  hasChecks = true, 
  showTotal = false,
  onDelete,
  onEdit,
  data = mockData,
  onViewModeChange,
  hideTitle = false,
  hideChecksInfo = false,
  onAddCheck,
  showAddButton = false,
  isApplicationMode = false
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  console.log(data, 'data')
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    onViewModeChange?.(viewMode);
  }, [viewMode, onViewModeChange]);

  const renderCard = (row: CheckRow) => (
    <div className={styles.card} key={row.id}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <span className={styles.cardLabel}>Чек №</span>
          <span className={styles.cardValue}>{row.id}</span>
        </div>
        <div className={styles.cardHeaderRight}>
          <span className={styles.cardLabel}>Дата:</span>
          <span className={styles.cardValue}>{row.date}</span>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.SellerBuyer}>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Покупатель:</span>
              <span className={`${styles.cardValue} ${styles.buyer}`}>ООО "КОМПАНИЯ 1"</span>
            </div>
            <div className={styles.cardRowINN}>
              <span className={styles.cardLabel}>ИНН</span>
              <span className={styles.cardValue}>13213912302</span>
            </div>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Продавец:</span>
              <span className={`${styles.cardValue} ${styles.seller}`}>ООО "КОМПАНИЯ 2"</span>
            </div>
            <div className={styles.cardRowINN}>
              <span className={styles.cardLabel}>ИНН</span>
              <span className={styles.cardValue}>13213912302</span>
            </div>
          </div>
        </div>
        <div className={styles.divEnd}>
          <div className={styles.cardSection}>
            <div className={styles.cardRow2}>
              <span className={styles.cardValue}>{row.product}</span>
              <span className={styles.cardValue}>{row.quantity} {row.unit}</span>
            </div>
          </div>
          <div className={styles.cardSection}>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Цена за ед. с НДС:</span>
              <span className={styles.cardValue}>{formatNumber(row.pricePerUnit)}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Стоимость с НДС:</span>
              <span className={styles.cardValue}>{formatNumber(row.totalPrice)}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>НДС 20%:</span>
              <span className={styles.cardValue}>{formatNumber(row.totalPrice * 0.2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationCard = (row: CheckRow, index: number) => {
    const total = row.totalPrice;
    const vat = total * 0.2;

    return (
      <div className={styles.card} key={row.id}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderLeft}>
            <span className={styles.cardValue}>№{index + 1}</span>
          </div>
          <div className={styles.cardHeaderRight}>
            <div className={styles.actions}>
              {onEdit && (
                <button onClick={() => onEdit(row.id)} className={styles.editButton}>
                  <EditIcon />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete?.(row.id)} className={styles.deleteButton}>
                  <Cross />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.divEnd}>
            <div className={styles.cardSection}>
              <div className={styles.cardRow2}>
                <span className={styles.cardValue}>{row.product}</span>
                <span className={styles.cardValue}>{row.quantity} {row.unit}</span>
              </div>
            </div>
            <div className={styles.cardSection}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Цена за ед. с НДС:</span>
                <span className={styles.cardValue}>{formatNumber(row.pricePerUnit)}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Стоимость с НДС:</span>
                <span className={styles.cardValue}>{formatNumber(total)}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>НДС 20%:</span>
                <span className={styles.cardValue}>{formatNumber(vat)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableRow = (row: CheckRow, index: number) => {
    const total = row.totalPrice;
    const vat = total * 0.2;

    return (
      <tr key={row.id}>
        <td>№{index + 1}</td>
        <td>
          <div className={styles.dateContainer}>
            <Calendar />
            <span>{row.date}</span>
          </div>
        </td>
        <td>{row.product}</td>
        <td>{row.unit}</td>
        <td>{row.quantity}</td>
        <td>{formatNumber(row.pricePerUnit)}</td>
        <td className={styles.vat}>{formatNumber(total)}</td>
        <td className={styles.vat}>{formatNumber(vat)}</td>
        {(onDelete || onEdit) && (
          <td className={styles.actions}>
            {onEdit && (
              <button onClick={() => onEdit(row.id)} className={styles.editButton}>
                <EditIcon />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete?.(row.id)} className={styles.deleteButton}>
                <Cross />
              </button>
            )}
          </td>
        )}
      </tr>
    );
  };

  const calculateTotals = () => {
    return data.reduce((acc, row) => {
      const total = row.totalPrice;
      const vat = total * 0.2;

      return {
        total: acc.total + total,
        vat: acc.vat + vat
      };
    }, { total: 0, vat: 0 });
  };

  const formatNumber = (num: number): string => {
    console.log(num, 'start')
    console.log(new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num), 'end')

    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
    
  };

  const totals = calculateTotals();

  const hasCardsForMobile = isMobile && viewMode === 'cards' && data.length > 0;

  return (
    <div className={`${styles.wrapper} ${isApplicationMode ? styles.applicationMode : ''}`}>
      <div className={styles.header}>
        {!hideTitle && (
          <div className={styles.titleBlock}>
            <h1>Чеки</h1>
            {!isApplicationMode && (
              <Button
                icon={<DownloadSvg />}
                variant="purple"
                styleLabel={{ fontSize: "14px" }}
                label="Экспортировать в XLS"
                style={{ width: "200px", height: "32px" }}
              />
            )}
            {isApplicationMode && (
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon />
                </button>
                <button
                  className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.active : ''}`}
                  onClick={() => setViewMode('cards')}
                >
                  <CardIcon />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {hasCardsForMobile && !hideChecksInfo && isApplicationMode && (
        <div className={styles.checksInfoWrapper}>
          <ChecksInfo
            dates={`${data[0]?.date} → ${data[data.length - 1]?.date}`}
            checksCount={data.length}
            sumWithVat={formatNumber(totals.total)}
            vat={formatNumber(totals.vat)}
            onAddCheck={onAddCheck}
            isApplicationMode={isApplicationMode}
          />
        </div>
      )}

      <div className={styles.container} data-view-mode={viewMode}>
        <table className={styles.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Товар</th>
              <th>Ед.изм.</th>
              <th>Кол-во</th>
              <th>Цена за ед. с НДС</th>
              <th>Стоимость с НДС</th>
              <th>НДС 20%</th>
              {(onDelete || onEdit) && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => renderTableRow(row, index))}
            {showTotal && (
              <tr className={styles.totalRow}>
                <td colSpan={6}>Итого:</td>
                <td className={styles.vat}>{formatNumber(totals.total)}</td>
                <td className={styles.vat}>{formatNumber(totals.vat)}</td>
                {(onDelete || onEdit) && <td></td>}
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map((row, index) => 
            isApplicationMode ? 
              renderApplicationCard(row, index) : 
              renderCard(row)
          )}
        </div>
      </div>

      {isApplicationMode && showAddButton && (
        <button 
          className={`${styles.addCheckButton} ${isMobile ? styles.mobileButton : ''}`} 
          onClick={onAddCheck}
        >
          <Plus />
          Добавить чек
        </button>
      )}
    </div>
  );
};

export default ChecksTable;
