import React from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/ui/page-title/page-title";
import {
  Message,
  AttachFile,
  SendSvg,
  ArrowLink,
  DownloadSvg,
} from "../../components/svgs/svgs";
import ChecksTable from '../../components/tables/checks-table/ckecks-table'
import Button from "../../components/ui/button/button";

import s from "./application-detailed.module.scss";
const ApplicationDetailed = () => {
  const { id } = useParams();
  return (
    <div>
      <PageTitle
        title="Заявка #01"
        statuses={["сreated", "issued"]}
        name={"Евгений"}
        date={"31/08/24"}
      />
      <div className={s.comments}>
        <div className={s.titleDiv}>
          <h2>Комментарии по заявке</h2>
          <p>Видны только администраторам</p>
        </div>
        <div className={s.nothingFound}>
          <Message />
          <p>Пока что комментариев нет</p>
        </div>
        <div className={s.inputContainer}>
          <div className={s.attachDiv}>
            <AttachFile />
          </div>
          <div className={s.inputDiv}>
            <input type="text" placeholder="Написать комментарий" />
            <div className={s.send}>
              <SendSvg />
            </div>
          </div>
        </div>
      </div>
      <div className={s.applicationInfo}>
        <h1 className={s.title}>Информация о заявке</h1>
        <div className={s.infoList}>
          <div className={s.infoCard}>
            <h2>ПОКУПАТЕЛЬ</h2>
            <div className={s.infoItem}>
              <p>Компания</p>
              <div className={s.link}>
                <h3>ЗАО "ТЕХНОЛОГИЯ"</h3>
                <ArrowLink />
              </div>
            </div>
            <div className={s.infoItem}>
              <p>ИНН</p>
              <div className={s.link}>
                <h3>9876543210</h3>
                <ArrowLink />
              </div>
            </div>
          </div>
          <div className={s.infoCard}>
            <h2>ПОКУПАТЕЛЬ</h2>
            <div className={s.infoItem}>
              <p>Компания</p>
              <div className={`${s.link} ${s.elit}`}>
                <h3>ООО "Инновации 2023"</h3>
                <div className={s.elitMark}>Элитная</div>
                <ArrowLink />
              </div>
            </div>
            <div className={s.infoItem}>
              <p>ИНН</p>
              <div className={s.link}>
                <h3>9876543210</h3>
                <ArrowLink />
              </div>
            </div>
          </div>
          <div className={s.infoCard}>
            <h2>КОМИССИЯ</h2>
            <div className={s.infoItem}>
              <p>Процент комиссии</p>
              <div className={`${s.link} ${s.none}`}>
                <h3>не установлено</h3>
              </div>
            </div>
            <div className={s.infoItem}>
              <p>Сумма комиссии</p>
              <div className={`${s.link} ${s.none}`}>
                <h3>не установлено</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={s.checks}>
        <div className={s.titleDiv}>
          <h1 className={s.title}>Чеки</h1>
          <Button
            icon={<DownloadSvg />}
            variant={"purple"}
            styleLabel={{ fontSize: "14px" }}
            label={"Экспортировать в XLS"}
            style={{ width: "200px", height: "32px" }}
          />
        </div>
        <div className={s.checkInfoList}>
         <div className={s.item}>
            <p>Даты</p>
            <h4>01/09/24 → 01/10/24</h4>
         </div>
         <div className={s.item}>
            <p>Кол-во чеков</p>
            <h4>12</h4>
         </div>
         <div className={s.item}>
            <p>Сумма с НДС</p>
            <h4>91,316.00</h4>
         </div>
         <div className={s.item}>
            <p>НДС 20%</p>
            <h4>91,316.00</h4>
         </div>
        </div>
      </div>
      <ChecksTable />
    </div>
  );
};

export default ApplicationDetailed;
