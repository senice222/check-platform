import React, { FC, useState } from "react";
import {
  BackArrow,
  Calendar,
  DetailedAvatar,
  ChangeStatus,
  EditSvg,
  Tick,
  ArrowLeft,
  TopArrow
} from "../../svgs/svgs";

import { ApplicationStatus } from "../../../constants/statuses";
import StatusBadge from "../status-badge/status-badge";
import Button from "../button/button";
import ChangingStatus from "../../changing-status/changing-status";
import CancelApplication from "../../modals/cancel-application/cancel-application";
import s from "./page-title.module.scss";
import IsEditingBar from "../../is-editing-bar/is-editing-bar";
import ChooseStatus from "../../modals/choose-status/chose-status";

interface PageTitleProps {
  title: string;
  statuses?: ApplicationStatus[];
  setStatuses?: (statuses: ApplicationStatus[]) => void;
  date: string;
  name: string;
  editing?: boolean;
  setEditing?: (value: boolean) => void;
  noRightBtns?: boolean;
}

const PageTitle: FC<PageTitleProps> = ({
  date,
  title,
  statuses = [],
  name,
  noRightBtns,
  setStatuses,
  editing = false,
  setEditing,
}) => {
  const [statusesOpened, setStatusesOpened] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [chooseStatusOpened, setChooseStatusOpened] = useState(false);
  const isMobile = window.innerWidth < 1000;

  const handleSave = () => {
    setEditing?.(false);
  };

  const handleEdit = () => {
    setEditing?.(true);
  };

  const handleCancel = () => {
    setCanceling(true);
  };

  const handleStatusChange = () => {
    if (isMobile) {
      setChooseStatusOpened(true);
    } else {
      setStatusesOpened(prev => !prev);
    }
  };

  const renderStatusBadges = () => {
    if (!statuses.length) return null;

    return (
      <div onClick={handleStatusChange} className={s.statuses}>
        {statuses.map((status) => (
          <StatusBadge key={status} status={status} big={true} />
        ))}
      </div>
    );
  };

  const renderRightButtons = () => {
    if (noRightBtns) return null;

    return (
      <div className={s.rightBtns}>
        <div className={s.statusesBtnDiv}>
          {editing ? (
            <Button
              onClick={handleCancel}
              variant="white"
              icon={<ChangeStatus />}
              label="Отмена"
              style={{ height: "32px", width: "100px" }}
              styleLabel={{ fontSize: "14px" }}
            />
          ) : (
            <>
              <Button
                onClick={handleStatusChange}
                variant="white"
                icon={<ChangeStatus />}
                label="Изменить статус"
                style={{ height: "32px", width: "162px" }}
                styleLabel={{ fontSize: "14px" }}
              />
              {statuses && setStatuses && (
                <ChangingStatus
                  statuses={statuses}
                  setStatuses={setStatuses}
                  isOpened={statusesOpened}
                  setOpened={handleStatusChange}
                />
              )}
            </>
          )}
        </div>

        {editing ? (
          <Button
            variant="purple"
            icon={<Tick />}
            onClick={handleSave}
            label="Сохранить изменения"
            style={{ height: "32px", width: "200px" }}
            styleLabel={{ fontSize: "14px" }}
          />
        ) : (
          <Button
            variant="white"
            onClick={handleEdit}
            icon={<EditSvg />}
            label="Редактировать"
            style={{ height: "32px", width: "150px" }}
            styleLabel={{ fontSize: "14px" }}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <CancelApplication
        isOpened={canceling}
        setOpen={setCanceling}
        setEditing={() => setEditing?.(false)}
      />
      <ChooseStatus 
        statuses={statuses}
        setStatuses={setStatuses}
        isOpened={chooseStatusOpened} 
        setOpen={setChooseStatusOpened}
      />
      <div className={s.responsiveHeader}>
        <div className={s.backBtn}>
          {editing ? <span onClick={handleCancel}>Отмена</span> : <><TopArrow />
            <span>Назад</span></>}
        </div>
        <h2>Заявка #01</h2>
        {editing ? (
          <button onClick={handleSave} className={s.editBtn}>Сохранить</button>
        ) : (
          <button onClick={handleEdit} className={s.editBtn}>Изменить</button>
        )}
      </div>
      <div className={s.pageTitle}>
        <IsEditingBar isEditing={editing} />

        <div className={s.globalLeft}>

          <div className={s.backArrow}>
            <BackArrow />
          </div>
          <div className={s.right}>
            <div className={s.top}>
              <h1 className={s.title}>{title}</h1>
              {renderStatusBadges()}
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
        {renderRightButtons()}
      </div>
    </>
  );
};

export default PageTitle;
