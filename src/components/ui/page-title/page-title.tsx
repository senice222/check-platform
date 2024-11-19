import React, { FC } from "react";
import { BackArrow, Calendar, DetailedAvatar, ChangeStatus, EditSvg } from "../../svgs/svgs";
import s from "./page-title.module.scss";
import Button from "../button/button";

interface PageTitleProps {
  title: string;
  statuses?: string[]; // 'сreated' | 'issued' | 'client_paid' | 'us_paid';
  date: string; // 31/08/24
  name: string;
}

const PageTitle: FC<PageTitleProps> = ({ date, title, statuses, name }) => {
  const getElement = (status: string) => {
    if (status === "сreated") {
      return (
        <div className={`${s.status1} ${s.purple}`} key={status}>
          <p>Создана</p>
        </div>
      );
    } else if (status === "issued") {
      return (
        <div className={`${s.status1} ${s.orange}`} key={status}>
          <p>Выдана СФ</p>
        </div>
      );
    } else if (status === "client_paid") {
      return (
        <div className={`${s.status1} ${s.blue}`} key={status}>
          <p>Оплачено клиентом</p>
        </div>
      );
    } else if (status === "us_paid") {
      return (
        <div className={`${s.status1} ${s.green}`} key={status}>
          <p>Оплачено нами</p>
        </div>
      );
    }
  };
  const statusDisplay = () => {
    if (statuses) {
      return (
        <div className={s.statuses}>
          {statuses.map((status) => getElement(status))}
        </div>
      );
    }
  };

  return (
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

      <div className={s.rightBtns}>
        <Button variant={'white'} icon={<ChangeStatus />} label="Изменить статус" style={{height: '32px', width: '162px'}} styleLabel={{fontSize: '14px'}}/>
        <Button variant={'white'} icon={<EditSvg />} label="Редактировать" style={{height: '32px', width: '150px'}} styleLabel={{fontSize: '14px'}}/>
      </div>
    </div>
  );
};

export default PageTitle;
