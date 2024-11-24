import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../../components/ui/page-title/page-title";
import {
  Message,
  AttachFile,
  SendSvg,
  ArrowLink,
  DownloadSvg,
} from "../../components/svgs/svgs";
import ChecksTable from "../../components/tables/checks-table/ckecks-table";
import Button from "../../components/ui/button/button";
import IsEditingBar from "../../components/is-editing-bar/is-editing-bar";
import Input from "../../components/ui/input/input";
import CustomSelect from "../../components/ui/custom-select/custom-select"
import s from "./application-detailed.module.scss";


const companies = [
  { "name": "ООО \"КОМПАНИЯ 1\"", "inn": "472819374102", "type": "standart" },
  { "name": "ООО \"КОМПАНИЯ 2\"", "inn": "382947561029", "type": "elit" },
  { "name": "ООО \"КОМПАНИЯ 3\"", "inn": "928374610384", "type": "standart" },
  { "name": "ООО \"КОМПАНИЯ 4\"", "inn": "738495610384", "type": "elit" },
  { "name": "ООО \"КОМПАНИЯ 5\"", "inn": "182736492810", "type": "standart" },
  { "name": "ООО \"КОМПАНИЯ 6\"", "inn": "837465910273", "type": "elit" },
  { "name": "ООО \"КОМПАНИЯ 7\"", "inn": "284756109283", "type": "standart" },
  { "name": "ООО \"КОМПАНИЯ 8\"", "inn": "495837261092", "type": "elit" },
  { "name": "ООО \"КОМПАНИЯ 9\"", "inn": "183746529310", "type": "standart" },
  { "name": "ООО \"КОМПАНИЯ 10\"", "inn": "937461028374", "type": "elit" }
];

const ApplicationDetailed = () => {
  const { id } = useParams();
  const [statuses, setStatuses] = useState<string[]>(["created"]);
  const [editing, setEditing] = useState(false);
  const [buyerCompanyName, setbuyerCompanyName] = useState("ООО “КОМПАНИЯ 1”");
  const [buyerInn, setBuyerInn] = useState("134841293138");
  const [currentCompany, setCurrentCompany] = useState(companies[0])

  return (
    <div>
      <IsEditingBar isEditing={editing} />
      <PageTitle
        title="Заявка #01"
        statuses={statuses}
        setStatuses={setStatuses}
        name={"Евгений"}
        editing={editing}
        setEditing={setEditing}
        date={"31/08/24"}
      />
      <div className={`${s.comments} ${editing ? s.hiddenComments : ""}`}>
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
        <div className={`${s.infoList}`}>
          <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
            <h2>ПОКУПАТЕЛЬ</h2>
            <div className={s.infoItem}>
              <p>Компания</p>
              <div className={s.link}>
                {editing ? (
                  <div className={s.editInput}>
                    <Input

                      value={buyerCompanyName}
                      noMargin={true}
                      onChange={(e) => setbuyerCompanyName(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <h3>{buyerCompanyName}</h3>
                    <ArrowLink />
                  </>
                )}
              </div>
            </div>
            <div className={s.infoItem}>
              <p>ИНН</p>
              <div className={s.link}>
                {editing ? (
                  <div className={s.editInput}>
                    <Input
                      noMargin={true}
                      value={buyerInn}
                      onChange={(e) => setBuyerInn(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <h3>{buyerInn}</h3>
                    <ArrowLink />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
            <h2>ПОКУПАТЕЛЬ</h2>
            <div className={s.infoItem}>
              <p>Компания</p>
              <div className={`${s.link} ${s.elit}`}>
                {editing ? (
                  <CustomSelect onChange={setCurrentCompany} defaultValue={currentCompany} companies={companies}/>
                ) : (
                  <>
                    <h3>ООО "Инновации 2023"</h3>
                    <div className={s.elitMark}>Элитная</div>
                    <ArrowLink />
                  </>
                )}
              </div>
            </div>
            <div className={s.infoItem}>
              <p>ИНН</p>
              <div className={s.link}>
              {editing ? (
                  <div className={s.editInput}>
                    <Input
                      disabled={true}
                      noMargin={true}
                      value={buyerInn}
                      onChange={(e) => setBuyerInn(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <h3>9876543210</h3>
                    <ArrowLink />
                  </>
                )}

              </div>
            </div>
          </div>
          <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
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
