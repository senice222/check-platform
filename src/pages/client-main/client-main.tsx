import React, { useState } from 'react'
import s from './client-main.module.scss'
import { CardBox, Plus, SendSvg, TopArrow } from '../../components/svgs/svgs'
import logo from '../../assets/clientLogo.png'
import leadIcon from '../../assets/lead-icon.png'
import logOut from '../../assets/logout.png'
import Button from '../../components/ui/button/button'
import Input from '../../components/ui/input/input'
import CheckBox from '../../components/ui/check-box/check-box'
import CompanySelect from '../../components/ui/company-select/company-select'
import AddCheckModal from '../../components/modals/add-check-modal/add-check-modal'
import ChecksTable from '../../components/tables/checks-table/ckecks-table'

interface Company {
    id: number;
    name: string;
    inn: string;
}

interface CheckData {
    id?: string;
    date: string;
    product: string;
    unit: string;
    quantity: string;
    priceWithVAT: string;
    totalWithVAT: string;
    vat20: string;
}

// Добавляем моковые данные
const mockData: CheckData[] = [
    { 
        id: "#1", 
        date: "25/10/24", 
        product: "Товар 1", 
        unit: "шт.", 
        quantity: "1000", 
        priceWithVAT: "91,316.00", 
        totalWithVAT: "91,316.00", 
        vat20: "15,219.33" 
    },
    { 
        id: "#2", 
        date: "25/10/24", 
        product: "Товар 2", 
        unit: "шт.", 
        quantity: "500", 
        priceWithVAT: "45,658.00", 
        totalWithVAT: "22,829.00", 
        vat20: "3,804.83" 
    },
    { 
        id: "#3", 
        date: "25/10/24", 
        product: "Товар 3", 
        unit: "шт.", 
        quantity: "750", 
        priceWithVAT: "68,487.00", 
        totalWithVAT: "51,365.25", 
        vat20: "8,560.88" 
    }
];

const ClientMain = () => {
    const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
    const [saveCompany, setSaveCompany] = useState(false);
    const [selectedSellerCompany, setSelectedSellerCompany] = useState<Company | null>(null);
    const [isAddCheckModalOpen, setIsAddCheckModalOpen] = useState(false);
    const [hasChecks, setHasChecks] = useState(true);
    const [editingCheck, setEditingCheck] = useState<CheckData | undefined>(undefined);
    const [checks, setChecks] = useState<CheckData[]>(mockData);

    const companies = [
        { id: 1, name: 'ООО "Компания"', inn: '2312324244' },
        { id: 2, name: 'ООО "Компания"', inn: '2312324244' },
        { id: 3, name: 'ООО "Компания"', inn: '2312324244' },
    ];

    const handleCheckSubmit = (checkData: CheckData) => {
        if (editingCheck) {
            setChecks(prevChecks => 
                prevChecks.map(check => 
                    check.id === checkData.id ? checkData : check
                )
            );
        } else {
            const newCheck = {
                ...checkData,
                id: `#${checks.length + 1}`
            };
            setChecks(prevChecks => [...prevChecks, newCheck]);
        }
        setEditingCheck(undefined);
    };

    const handleEditCheck = (id: string) => {
        const checkToEdit = checks.find(check => check.id === id);
        if (checkToEdit) {
            setEditingCheck(checkToEdit);
            setIsAddCheckModalOpen(true);
        }
    };

    const handleDeleteCheck = (id: string) => {
        setChecks(prevChecks => prevChecks.filter(check => check.id !== id));
        if (checks.length === 1) {
            setHasChecks(false);
        }
    };

    return (
        <>
            <AddCheckModal 
                isOpened={isAddCheckModalOpen}
                setOpen={(isOpen) => {
                    setIsAddCheckModalOpen(isOpen);
                    if (!isOpen) setEditingCheck(undefined);
                }}
                editData={editingCheck}
                onSubmit={handleCheckSubmit}
            />
            
            <div className={s.clientMain}>
                <div className={s.clientMain__header}>
                    <img src={logo} alt="logo" />
                    <div className={s.newApplicationBtn}>
                        <Plus />
                        <span>Новая заявка</span>
                    </div>
                    <Button label='Выход' variant='white' style={{ width: '85px', height: '32px' }} icon={<img src={logOut} alt="logOut" />} styleLabel={{ color: '#14151A', fontSize: '14px', fontWeight: '500' }} />
                </div>
                <div className={s.titleDiv}>
                    <h2>Новая заявка</h2>
                    <Button label='Отправить заявку' icon={<img src={leadIcon} alt="leadIcon" />} variant='purple' style={{ width: '185px', height: '40px' }} />
                </div>
                <div className={s.applicationInfo}>
                    <h2 className={s.title2}>Информация о заявке</h2>
                    <div className={s.blocks}>
                        <div className={s.block}>
                            <p className={s.type}>ПОКУПАТЕЛЬ</p>
                            <div className={s.savedCompanies}>
                                <p className={s.heading}>Сохраненные компании</p>
                                <div className={s.list}>
                                    {companies.map((company) => (
                                        <div
                                            key={company.id}
                                            className={`${s.company} ${activeCompanyId === company.id ? s.active : ''}`}
                                            onClick={() => setActiveCompanyId(company.id)}
                                        >
                                            <h6>{company.name}</h6>
                                            <p>ИНН {company.inn}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={s.orDiv}>
                                <div className={s.line}></div>
                                <div className={s.orText}>или</div>
                            </div>
                            <div className={s.inputs}>
                                <Input label='Название компании' placeholder='Введите название компании' />
                                <Input label='ИНН' placeholder='Введите ИНН' />
                            </div>
                            <div className={s.checkBox}>
                                <CheckBox isChecked={saveCompany} setChecked={() => setSaveCompany(!saveCompany)} />
                                <p onClick={() => setSaveCompany(!saveCompany)}>Сохранить компанию в системе</p>
                            </div>
                        </div>
                        <div className={s.block}>
                            <p className={s.type}>ПРОДАВЕЦ</p>
                            <CompanySelect
                                label="Название компании"
                                companies={companies}
                                selectedCompany={selectedSellerCompany}
                                onSelect={(company: Company) => setSelectedSellerCompany(company)}
                            />

                            <Input label='ИНН' placeholder='Введите ИНН' />

                        </div>
                    </div>

                </div>
                <div className={s.checks}>
                    <h1 className={s.title4}>Чеки</h1>
                    {!hasChecks ? (
                        <div className={s.block}>
                            <CardBox />
                            <h2 className={s.titlte213}>Пока что тут нет чеков</h2>
                            <p className={s.deskripua}>Для добавления нажмите на кнопку ниже</p>
                            <Button 
                                label='Добавить чек' 
                                variant='purple' 
                                style={{ width: '400px', height: '40px', marginTop: '16px' }} 
                                styleLabel={{ fontSize: '14px', fontWeight: '500' }}
                                onClick={() => {
                                    setEditingCheck(undefined);
                                    setIsAddCheckModalOpen(true);
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <ChecksTable 
                                hasChecks={true}
                                showTotal={true}
                                data={checks}
                                onDelete={handleDeleteCheck}
                                onEdit={handleEditCheck}
                            />
                            <div className={s.bottomBtnDiv}>
                                <button onClick={() => {
                                    setEditingCheck(undefined);
                                    setIsAddCheckModalOpen(true);
                                }}>
                                    <Plus />
                                    Добавить чек
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default ClientMain
