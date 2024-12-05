import React, { FC, useEffect, useState } from "react";
import { type ApplicationStatus } from "../../constants/statuses";
import StatusBadge from "../ui/status-badge/status-badge";
import CheckBox from "../ui/check-box/check-box";
import s from "./changing-status.module.scss";
import ChooseStatus from "../modals/choose-status/chose-status";

interface ChangingStatusProps {
  statuses: ApplicationStatus[];
  setStatuses: (statuses: ApplicationStatus[]) => void;
  isOpened: boolean;
  setOpened: () => void;
}

const ChangingStatus: FC<ChangingStatusProps> = ({
  statuses,
  setStatuses,
  isOpened,
  setOpened,
}) => {
  const allStatuses = [
    ApplicationStatus.NEW,
    ApplicationStatus.IN_PROGRESS,
    ApplicationStatus.COMPLETED,
    ApplicationStatus.CANCELLED
  ];
  const [opened, setOpen] = useState(false);
  const isMobile = window.innerWidth < 1000;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${s.changingStatus}`) && !target.closest('button')) {
        setOpened();
      }
    };

    if (isOpened && !isMobile) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpened, setOpened, isMobile]);

  const handleClick = (status: ApplicationStatus) => {
    if (isMobile) {
      setOpen(true);
      return;
    }

    if (statuses.includes(status)) {
      setStatuses(statuses.filter((s) => s !== status));
    } else {
      setStatuses([...statuses, status]);
    }
  };

  return (
    <>
      <ChooseStatus 
        isOpened={opened} 
        setOpen={setOpen} 
        setStatuses={setStatuses}
        statuses={statuses}
      />
      <div
        className={`${s.changingStatus} ${isOpened ? s.opened : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
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
    </>
  );
};

export default ChangingStatus;
