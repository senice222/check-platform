import { useState, useEffect } from "react";
import styles from "./ckecks-table.module.scss";
import { Calendar, TableIcon, CardIcon } from '../../svgs/svgs';

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

const ChecksTable = () => {
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

  const data: CheckRow[] = [
    { id: "#1", date: "25/10/24", product: "Brandon Clark", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#2", date: "25/10/24", product: "Ryan Mitchell", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#3", date: "25/10/24", product: "Mia Rodriguez", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#4", date: "25/10/24", product: "Katherine Turner", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#5", date: "25/10/24", product: "Sarah Reynolds", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#6", date: "25/10/24", product: "David Larson", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#7", date: "25/10/24", product: "Emma Thompson", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
  ];

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
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
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
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.cardsContainer} data-view-mode={viewMode}>
          {data.map(renderCard)}
        </div>
      </div></>

  );
};

export default ChecksTable;
