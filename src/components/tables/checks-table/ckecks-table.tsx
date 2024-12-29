import { useState, useEffect } from "react";
import styles from "./ckecks-table.module.scss";
import { Calendar, TableIcon, CardIcon, EditSvg as EditIcon, Trash as Cross } from '../../svgs/svgs';

interface CheckRow {
  id: string;
  date: string;
  product: string;
  unit: string;
  quantity: number;
  priceWithVAT: string;
  totalWithVAT: string;
  vat20: string;
}

interface ChecksTableProps {
  hasChecks?: boolean;
  showTotal?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  data?: CheckRow[];
}

const mockData: CheckRow[] = [
  { 
    id: "#1", 
    date: "25/10/24", 
    product: "Товар 1", 
    unit: "шт.", 
    quantity: 1000, 
    priceWithVAT: "91,316.00", 
    totalWithVAT: "91,316.00", 
    vat20: "15,219.33" 
  },
  { 
    id: "#2", 
    date: "25/10/24", 
    product: "Товар 2", 
    unit: "шт.", 
    quantity: 500, 
    priceWithVAT: "45,658.00", 
    totalWithVAT: "22,829.00", 
    vat20: "3,804.83" 
  },
  { 
    id: "#3", 
    date: "25/10/24", 
    product: "Товар 3", 
    unit: "шт.", 
    quantity: 750, 
    priceWithVAT: "68,487.00", 
    totalWithVAT: "51,365.25", 
    vat20: "8,560.88" 
  }
];

const ChecksTable: React.FC<ChecksTableProps> = ({ 
  hasChecks = true, 
  showTotal = false,
  onDelete,
  onEdit,
  data = mockData
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              <span className={styles.cardValue}>{row.priceWithVAT}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Стоимость с НДС:</span>
              <span className={styles.cardValue}>{row.totalWithVAT}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>НДС 20%:</span>
              <span className={styles.cardValue}>{row.vat20}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTableRow = (row: CheckRow) => (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>
        <div className={styles.dateContainer}>
          <Calendar />
          <span>{row.date}</span>
        </div>
      </td>
      <td>{row.product}</td>
      <td>{row.unit}</td>
      <td>{row.quantity}</td>
      <td>{row.priceWithVAT}</td>
      <td className={styles.vat}>{row.totalWithVAT}</td>
      <td className={styles.vat}>{row.vat20}</td>
      {(onDelete || onEdit) && (
        <td className={styles.actions}>
          {onEdit && (
            <button onClick={() => onEdit(row.id)} className={styles.editButton}>
              <EditIcon />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(row.id)} className={styles.deleteButton}>
              <Cross />
            </button>
          )}
        </td>
      )}
    </tr>
  );

  const totals = data.reduce((acc, row) => ({
    totalWithVAT: acc.totalWithVAT + parseFloat(row.totalWithVAT.replace(',', '')),
    vat20: acc.vat20 + parseFloat(row.vat20.replace(',', ''))
  }), { totalWithVAT: 0, vat20: 0 });

  return (
    <>
      {isMobile && (
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
            {data.map(renderTableRow)}
            {showTotal && (
              <tr className={styles.totalRow}>
                <td colSpan={6}>Итого:</td>
                <td className={styles.vat}>{totals.totalWithVAT.toFixed(2)}</td>
                <td className={styles.vat}>{totals.vat20.toFixed(2)}</td>
                {(onDelete || onEdit) && <td></td>}
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map(renderCard)}
        </div>
      </div></>

  );
};

export default ChecksTable;
