import { ArrowSelect } from '../../svgs/svgs';
import styles from './select.module.scss';

const Select = ({ icon, label }: { icon: JSX.Element, label: string }) => {
   return (
      <div className={styles.customSelect}>
         <div className={styles.icon}>{icon}</div>
         <p className={styles.label}>{label}</p>
         <div className={styles.arrow}><ArrowSelect /></div>
      </div>
   );
};

export default Select;
