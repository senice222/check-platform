import styles from "./ckecks-table.module.scss";
import {Calendar} from '../../svgs/svgs'

const ChecksTable = () => {
   const data = [
      { id: "1", date: "02/09/2024", product: "Ноутбук", unit: "шт", quantity: 1, priceWithVAT: "₽63,000", totalWithVAT: "₽63,000", vat20: "₽10,500" },
      { id: "2", date: "03/09/2024", product: "Принтер", unit: "шт", quantity: 2, priceWithVAT: "₽30,000", totalWithVAT: "₽60,000", vat20: "₽10,000" },
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
               {data.map((row, index) => (
                  <tr key={index}>
                     <td>{row.id}</td>
                     <td><div className={styles.dateContainer}><Calendar /><span>{row.date}</span></div></td>
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
