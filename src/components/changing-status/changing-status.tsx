import React, { FC, useState, useEffect, useRef } from "react";
import s from "./changing-status.module.scss";
import CheckBox from "../ui/check-box/check-box";
import { getElement } from "../../components/ui/page-title/page-title";

interface ChangingStatusItemI {
  status: string;
  statuses: string[];
  setStatuses: (statuses : string[]) => void;
}

interface ChangingStatusI {
  isOpened: boolean;
  setOpened: () => void;
  statuses: string[];
  setStatuses: (statuses : string[]) => void;

}

const ChangingStatusItem: FC<ChangingStatusItemI> = ({ status, statuses, setStatuses }) => {

  const setChecked = () => {
    if (statuses.includes(status)) {
      setStatuses(statuses.filter((item) => item !== status));
    } else {
      setStatuses([...statuses, status]);
    }
  }

  return (
    <div onClick={setChecked} className={s.item}>
      <CheckBox setChecked={null} isChecked={statuses.includes(status)} />
      <div className={s.status}>{getElement(status, true)}</div>
    </div>
  );
};

const ChangingStatus: FC<ChangingStatusI> = ({ isOpened, setOpened, statuses, setStatuses }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      if (isOpened) {
        setOpened();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpened]);

  return (
    <div
      ref={wrapperRef}
      className={`${s.ChangingStatus} ${isOpened ? s.opened : s.closed}`}
    >
      <ChangingStatusItem statuses={statuses} setStatuses={setStatuses} status={"created"} />
      <ChangingStatusItem statuses={statuses} setStatuses={setStatuses} status={"issued"} />
      <ChangingStatusItem statuses={statuses} setStatuses={setStatuses} status={"client_paid"} />
      <ChangingStatusItem statuses={statuses} setStatuses={setStatuses} status={"us_paid"} />
    </div>
  );
};

export default ChangingStatus;
