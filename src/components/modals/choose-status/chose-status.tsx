import React, { FC } from 'react';
import s from './choose-status.module.scss';
import Modal from '../../ui/modal/modal';
import { ApplicationStatus } from '../../../constants/statuses';
import StatusBadge from '../../ui/status-badge/status-badge';
import CheckBox from '../../ui/check-box/check-box';
import Button from '../../ui/button/button';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  setStatuses?: (statuses: ApplicationStatus[]) => void;
  statuses?: ApplicationStatus[];

}

const ChooseStatus: FC<Props> = ({ isOpened, setOpen, setStatuses : setFinalStatuses, statuses : initialStatuses }) => {
  const allStatuses: ApplicationStatus[] = ['created', 'issued', 'client_paid', 'us_paid'];
  const [statuses, setStatuses] = React.useState<ApplicationStatus[]>(initialStatuses || []);

  const handleClick = (status: ApplicationStatus) => {
    if (statuses.includes(status)) {
      setStatuses(statuses.filter((s) => s !== status));
    } else {
      setStatuses([...statuses, status]);
    }
  };
  const handleSave = () => {
    setFinalStatuses?.(statuses);
    setOpen(false);
  }
  
  return (
    <Modal 
      title='Статусы заявки #01' 
      setOpen={setOpen} 
      isOpened={isOpened}
    >
      <div className={s.content}>
        <div className={s.statusList}>
          {allStatuses.map((status) => (
            <div
              key={status}
              onClick={() => handleClick(status)}
              className={s.statusItem}
            >
              <CheckBox
                isChecked={statuses.includes(status)}
                setChecked={() => handleClick(status)}
              />
              <StatusBadge
                status={status}
                bordered={true}
              />
            </div>
          ))}
        </div>
        
        <div className={s.actions}>
          <Button 
            style={{width: '100%', height: '46px'}} 
            styleLabel={{fontSize: '14px', fontWeight: '500'}} 
            variant='purple' 
            label='Сохранить' 
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChooseStatus;
