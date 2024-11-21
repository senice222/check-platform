import styles from './select-group.module.scss'
import Select from '../ui/select/select';
import { CalendarIcon, Company, Dollar, Flag, Seller, User } from '../svgs/svgs';
import DateSelector from '../ui/date-selector/date-selector';

const SelectGroup = () => {
  const options = [
    { icon: <User />, label: 'По клиенту' },
    { icon: <Dollar />, label: 'По сумме' },
    { icon: <Company />, label: 'По компаниям' },
    { icon: <Seller />, label: 'По продавцу' },
    { icon: <Flag />, label: 'По статусам' },
  ];

  return (
    <div className={styles.selectGroup}>
      <DateSelector />
      {options.map((option, index) => (
        <Select key={index} icon={option.icon} label={option.label} />
      ))}
    </div>
  );
};

export default SelectGroup;
