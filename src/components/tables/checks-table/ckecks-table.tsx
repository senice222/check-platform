import styles from "./ckecks-table.module.scss";
import { Calendar } from '../../svgs/svgs';

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
  const data: CheckRow[] = [
    { id: "#1", date: "25/10/24", product: "Brandon Clark", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#2", date: "25/10/24", product: "Ryan Mitchell", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#3", date: "25/10/24", product: "Mia Rodriguez", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#4", date: "25/10/24", product: "Katherine Turner", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#5", date: "25/10/24", product: "Sarah Reynolds", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#6", date: "25/10/24", product: "David Larson", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
    { id: "#7", date: "25/10/24", product: "Emma Thompson", unit: "шт.", quantity: 1000, priceWithVAT: "91,316.00", totalWithVAT: "91,316.00", vat20: "91,316.00" },
  ];

  return (
    <div className={styles.container}>
      <table className={styles.table}>
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
    </div>
  );
};

export default ChecksTable;
