import React, { FC, useState } from "react";
import {
  BackArrow,
  Calendar,
  DetailedAvatar,
  ChangeStatus,
  EditSvg,
  Tick
} from "../../svgs/svgs";
import s from "./page-title.module.scss";
import Button from "../button/button";
import ChangingStatus from "../../changing-status/changing-status";
import CancelApplication from "../../modals/cancel-application/cancel-application";


interface PageTitleProps {
  title: string;
  statuses?: string[];
  setStatuses?: (statuses: string[]) => void; // 'сreated' | 'issued' | 'client_paid' | 'us_paid';
  date: string; // 31/08/24
  name: string;
  editing?: boolean;
  setEditing?: (value: boolean) => void;
  noRightBtns?: boolean;
}

export const getElement = (status: string, bordered?: boolean) => {
  const borderClass = bordered ? s.bordered : ""; // Добавляем класс "bordered", если bordered true
  if (status === "created") {
    return (
      <div className={`${s.status1} ${s.purple} ${borderClass}`} key={status}>
        <p>Создана</p>
      </div>
    );
  } else if (status === "issued") {
    return (
      <div className={`${s.status1} ${s.orange} ${borderClass}`} key={status}>
        <p>Выдана СФ</p>
      </div>
    );
  } else if (status === "client_paid") {
    return (
      <div className={`${s.status1} ${s.blue} ${borderClass}`} key={status}>
        <p>Оплачено клиентом</p>
      </div>
    );
  } else if (status === "us_paid") {
    return (
      <div className={`${s.status1} ${s.green} ${borderClass}`} key={status}>
        <p>Оплачено нами</p>
      </div>
    );
  } else if (status === "elit") {
    return (
      <div className={`${s.status1} ${s.elit} ${borderClass}`} key={status}>
        <p>Элитная</p>
      </div>
    );
  } else {
    return null;
  }
};

const PageTitle: FC<PageTitleProps> = ({
  date,
  title,
  statuses,
  name,
  noRightBtns,
  setStatuses,
  editing,
  setEditing,
}) => {
  const [statusesOpened, setStatusesOpened] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const statusDisplay = () => {
    if (statuses) {
      return (
        <div className={s.statuses}>
          {statuses.map((status) => getElement(status))}
        </div>
      );
    }
  };
  const saveHandle = () => {
    if (setEditing) {
      setEditing(false);
    }
  }
  return (
    <>
    <CancelApplication isOpened={canceling} setOpen={setCanceling} setEditing={() => setEditing && setEditing(false)}/>
    <div className={s.pageTitle}>
      <div className={s.globalLeft}>
        <div className={s.backArrow}>
          <BackArrow />
        </div>
        <div className={s.right}>
          <div className={s.top}>
            <h1 className={s.title}>{title}</h1>
            {statusDisplay()}
          </div>
          <div className={s.bott}>
            <div className={s.infoBlock}>
              <div className={s.svg}>
                <Calendar />
              </div>
              <p>{date}</p>
            </div>
            <div className={s.infoBlock}>
              <div className={s.svg}>
                <DetailedAvatar />
              </div>
              <p>{name}</p>
            </div>
          </div>
        </div>
      </div>

      {noRightBtns ? null : (
        <div className={s.rightBtns}>
          <div className={s.statusesBtnDiv}>
            {
              editing ? <Button
              onClick={() => setCanceling(true)}

              variant={"white"}
              icon={<ChangeStatus />}
              label="Отмена"
              style={{ height: "32px", width: "100px" }}
              styleLabel={{ fontSize: "14px" }}
            />: <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusesOpened((prev) => !prev);
                  }}
                  variant={"white"}
                  icon={<ChangeStatus />}
                  label="Изменить статус"
                  style={{ height: "32px", width: "162px" }}
                  styleLabel={{ fontSize: "14px" }}
                />
                {statuses && setStatuses ? (
                  <ChangingStatus
                    statuses={statuses}
                    setStatuses={setStatuses}
                    isOpened={statusesOpened}
                    setOpened={() => setStatusesOpened((prev) => !prev)}
                  />
                ) : null}</>
            }
          </div>
          {editing ? <Button
            variant={"purple"}
            icon={<Tick />}
            onClick={saveHandle}
            label="Сохранить изменения"
            style={{ height: "32px", width: "200px" }}
            styleLabel={{ fontSize: "14px" }}
          /> : <Button
            variant={"white"}
            onClick={() => {
              if (setEditing) {
                setEditing(true)
              }
            }}
            icon={<EditSvg />}
            label="Редактировать"
            style={{ height: "32px", width: "150px" }}
            styleLabel={{ fontSize: "14px" }}
          />}
        </div>
      )}
    </div>
    </>
  );
};

export default PageTitle;
