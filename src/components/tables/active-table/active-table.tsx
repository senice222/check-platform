import styles from "./active-table.module.scss";
import { ClientAvatar, SearchIcon } from "../../svgs/svgs";

const ActiveTable = () => {
   const data = [
      { id: "#01", status: "Создана", company: "ЗАО 'ТЕХНОЛОГИЯ'", seller: "ООО 'Инновации 2023'", checks: "02/09/24 → 02/10/24", client: { name: "Григорий", avatar: <ClientAvatar /> }, sum: "₽63,000" },
      { id: "#02", status: "Создана", company: "ЗАО 'ИННОВАЦИИ'", seller: "ООО 'Технологии Будущего'", checks: "03/09/24 → 03/10/24", client: { name: "Михаил", avatar: <ClientAvatar /> }, sum: "₽120,000" },
   ];

   return (
      <div className={styles.container}>
         <div className={styles.searchWrapper}>
            <span className={styles.icon}>
               <SearchIcon />
            </span>
            <input className={styles.search} type="text" placeholder="Поиск по заявкам" />
         </div>
         <table className={styles.table}>
            <thead>
               <tr>
                  <th>№</th>
                  <th>Статус</th>
                  <th>Компания</th>
                  <th>Продавец</th>
                  <th>Чеки</th>
                  <th>Клиент</th>
                  <th>Сумма</th>
               </tr>
            </thead>
            <tbody>
               {data.map((row, index) => (
                  <tr key={index}>
                     <td>{row.id}</td>
                     <td className={styles.status}>{row.status}</td>
                     <td>
                        <div className={styles.companyDiv}>
                           <span className={styles.companyName}>{row.company}</span>
                           <span className={styles.inn}>ИНН 9876543210</span>
                        </div>
                     </td>
                     <td>
                        <div className={styles.companyDiv}>
                           <span className={styles.sellerName}>{row.seller}</span>
                           <span className={styles.inn}>ИНН 9876543210</span>
                        </div>
                     </td>
                     <td>
                        <div className={styles.companyDiv}>
                           <span className={styles.checks}>{row.checks}</span>
                           <span className={styles.inn}>15 чеков</span>
                        </div>
                     </td>
                     <td>
                        <div className={styles.clientDiv}>
                           {row.client.avatar}
                           <span className={styles.clientName}>{row.client.name}</span>
                        </div>
                     </td>
                     <td className={styles.sum}>{row.sum}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default ActiveTable;
