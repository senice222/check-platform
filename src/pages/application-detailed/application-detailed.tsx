import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Company, ApplicationInfo } from "../../types/company.types";
import { companies } from "../../constants/companies";
import { Plus } from "../../components/svgs/svgs";
import PageTitle from "../../components/ui/page-title/page-title";
import ChecksTable from "../../components/tables/checks-table/ckecks-table";
import IsEditingBar from "../../components/is-editing-bar/is-editing-bar";
import Comments from "../../components/comments/comments";
import InfoCard from "../../components/info-card/info-card";
import ChecksInfo from "../../components/checks-info/checks-info";
import { ApplicationStatus } from "../../constants/statuses";
import s from "./application-detailed.module.scss";
import HistoryTable from "../../components/tables/history-table/history-table";

const INITIAL_APPLICATION_INFO: ApplicationInfo = {
  seller: {
    companyName: "ООО \"КОМПАНИЯ 1\"",
    inn: "134841293138"
  },
  buyer: companies[0],
  commission: {
    percentage: "10",
    amount: "0"
  }
};

const ApplicationDetailed = () => {
  const { id } = useParams();
  const [statuses, setStatuses] = useState<ApplicationStatus[]>(["created"]);
  const [editing, setEditing] = useState(false);
  const [applicationInfo, setApplicationInfo] = useState<ApplicationInfo>(INITIAL_APPLICATION_INFO);

  const handleSellerChange = (field: keyof typeof applicationInfo.seller, value: string) => {
    setApplicationInfo(prev => ({
      ...prev,
      seller: {
        ...prev.seller,
        [field]: value
      }
    }));
  };

  const handleBuyerChange = (company: Company) => {
    setApplicationInfo(prev => ({
      ...prev,
      buyer: company
    }));
  };

  const handleCommissionChange = (percentage: string) => {
    const amount = String(91316 * +percentage / 100);
    setApplicationInfo(prev => ({
      ...prev,
      commission: {
        percentage,
        amount
      }
    }));
  };

  return (
    <div>
      <IsEditingBar isEditing={editing}  desktop={true}/>
      <PageTitle
        title="Заявка #01"
        statuses={statuses}
        setStatuses={setStatuses}
        name="Евгений"
        editing={editing}
        setEditing={setEditing}
        date="31/08/24"
      />
      <Comments editing={editing} />

      <div className={s.applicationInfo}>
        <h1 className={s.title}>Информация о заявке</h1>
        <div className={s.infoList}>
          <InfoCard
            title="ПРОДАВЕЦ"
            editing={editing}
            fields={[
              {
                label: "Компания",
                value: applicationInfo.seller.companyName,
                onChange: (value) => handleSellerChange('companyName', value)
              },
              {
                label: "ИНН",
                value: applicationInfo.seller.inn,
                onChange: (value) => handleSellerChange('inn', value)
              }
            ]}
          />

          <InfoCard
            title="ПОКУПАТЕЛЬ"
            editing={editing}
            isCustomSelect
            company={applicationInfo.buyer}
            companies={companies}
            onCompanyChange={handleBuyerChange}
          />

          <InfoCard
            title="КОМИССИЯ"
            editing={editing}
            fields={[
              {
                label: "Процент комиссии",
                value: applicationInfo.commission.percentage,
                onChange: handleCommissionChange,
                suffix: "%",
                hideArrow: true
              },
              {
                label: "Сумма комиссии",
                value: applicationInfo.commission.amount,
                disabled: true,
                onChange: () => { },
                hideArrow: true
              }
            ]}
          />
        </div>
      </div>

      <ChecksInfo
        dates="01/09/24 → 01/10/24"
        checksCount={12}
        sumWithVat="91,316.00"
        vat="91,316.00"
      />

      <ChecksTable />

      {!editing && <div className={s.historySection}>
        <h1 className={s.title}>История изменений</h1>
        <HistoryTable />
      </div>}

      {editing && (
        <div className={s.bottomBtnDiv}>
          <button>
            <Plus />
            Добавить чеки
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailed;
