import React, { useState, useMemo, useEffect } from 'react'
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
import ClientChecksTable from '../../components/tables/client-checks-table/client-checks-table'
import SellerSelect from '../../components/ui/seller-select/seller-select'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getAllSellers } from '../../store/slices/sellerSlice'
import { createApplication } from '../../store/slices/applicationSlice'
import { useNotification } from '../../contexts/NotificationContext/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { fetchSavedCompanies } from '../../store/slices/clientSlice'

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

const ClientMain = () => {
    const dispatch = useAppDispatch();
    const { savedCompanies, savedCompaniesLoading, currentClient } = useAppSelector(state => state.client);
    const { sellers } = useAppSelector(state => state.seller);
    const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
    const [saveCompany, setSaveCompany] = useState(false);
    const [selectedSellerCompany, setSelectedSellerCompany] = useState<Company | null>(null);
    const [isAddCheckModalOpen, setIsAddCheckModalOpen] = useState(false);
    const [hasChecks, setHasChecks] = useState(false);
    const [editingCheck, setEditingCheck] = useState<CheckData | undefined>(undefined);
    const [checks, setChecks] = useState<CheckData[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [sellerInn, setSellerInn] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyInn, setCompanyInn] = useState('');
    const [sellerError, setSellerError] = useState('');
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const companies = [
        { id: 1, name: 'ООО "Компания"', inn: '2312324244' },
        { id: 2, name: 'ООО "Компания"', inn: '2312324244' },
        { id: 3, name: 'ООО "Компания"', inn: '2312324244' },
    ];

    // Загрузка продавцов при монтировании
    useEffect(() => {
        dispatch(getAllSellers({}));
    }, [dispatch]);
    
    // Загружаем сохраненные компании при монтировании
    useEffect(() => {
        dispatch(fetchSavedCompanies());
    }, [dispatch]);

    const handleCheckSubmit = (checkData: CheckData) => {
        // Форматируем числа в нужный формат
        const formattedCheck = {
            ...checkData,
            priceWithVAT: new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(parseFloat(checkData.priceWithVAT)),
            totalWithVAT: new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(parseFloat(checkData.totalWithVAT)),
            vat20: new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(parseFloat(checkData.vat20))
        };

        if (editingCheck) {
            setChecks(prevChecks => 
                prevChecks.map(check => 
                    check.id === editingCheck.id ? { ...formattedCheck, id: check.id } : check
                )
            );
        } else {
            const newCheck = {
                ...formattedCheck,
                id: `temp_${Date.now()}`
            };
            setChecks(prevChecks => [...prevChecks, newCheck]);
            setHasChecks(true);
        }
        setIsAddCheckModalOpen(false);
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
        setChecks(prevChecks => {
            const updatedChecks = prevChecks.filter(check => check.id !== id);
            if (updatedChecks.length === 0) {
                setHasChecks(false);
            }
            return updatedChecks;
        });
    };

    // Добавляем обработчик перетаскивания
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const ele = e.currentTarget;
        const startPos = {
            left: ele.scrollLeft,
            x: e.clientX,
        };

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x;
            ele.scrollLeft = startPos.left - dx;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Добавим функцию для подсчета итогов
    const calculateTotals = useMemo(() => {
        return checks.reduce((acc, check) => {
            const total = parseFloat(check.totalWithVAT.replace(/[^\d.-]/g, ''));
            const vat = parseFloat(check.vat20.replace(/[^\d.-]/g, ''));
            
            return {
                total: acc.total + total,
                vat: acc.vat + vat
            };
        }, { total: 0, vat: 0 });
    }, [checks]);

    // Форматирование числа для отображения
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const handleSellerChange = (sellerId: string, inn: string) => {
        setSelectedSeller(sellerId);
        setSellerInn(inn); // Автоматически устанавливаем ИНН продавца
    };

    const handleSubmit = async () => {
        if (!companyName || !companyInn || !selectedSeller) {
            addNotification('Заполните все обязательные поля', 'error');
            return;
        }

        try {
            const formatDate = (dateStr: string) => {
                if (!dateStr) return '';
                const parts = dateStr.split('/');
                if (parts.length !== 3) return dateStr;
                const [day, month, year] = parts;
                const fullYear = year.length === 2 ? `20${year}` : year;
                return `${fullYear}-${month}-${day}`;
            };

            const parsePrice = (priceStr: string) => {
                if (!priceStr) return 0;
                // Убираем все пробелы и заменяем запятую на точку
                const cleanPrice = priceStr.replace(/\s/g, '').replace(',', '.');
                // Возвращаем число без умножения на 100, так как сервер это сделает сам
                return parseFloat(cleanPrice);
            };

            const applicationData = {
                companyName,
                companyInn,
                sellerId: selectedSeller,
                shouldSaveCompany: saveCompany,
                checks: checks.map(check => ({
                    date: formatDate(check.date),
                    product: check.product,
                    quantity: parseFloat(check.quantity || '0'),
                    pricePerUnit: parsePrice(check.priceWithVAT),
                    unit: check.unit
                }))
            };

            await dispatch(createApplication(applicationData));
            
            // Очищаем все поля после успешного создания
            setCompanyName('');
            setCompanyInn('');
            setSelectedSeller('');
            setSellerInn('');
            setChecks([]);
            setSaveCompany(false);
            setActiveCompanyId(null);
            setHasChecks(false);
            
            addNotification('Заявка успешно создана', 'success');
        } catch (error) {
            console.log(error);
            addNotification(
                error.response?.data?.message || 'Ошибка при создании заявки',
                'error'
            );
        }
    };

    // Проверяем, может ли пользователь сохранять компании
    const canSaveCompanies = currentClient?.canSave;

    // Обработчик выбора сохраненной компании
    const handleSavedCompanySelect = (company: SavedCompany) => {
        setActiveCompanyId(company.id);
        setCompanyName(company.name);
        setCompanyInn(company.inn);
        // При выборе сохраненной компании отключаем чекбокс
        setSaveCompany(false);
    };

    // Обработчик изменения полей компании
    const handleCompanyFieldChange = (field: 'name' | 'inn', value: string) => {
        if (field === 'name') {
            setCompanyName(value);
        } else {
            setCompanyInn(value);
        }
        // При ручном вводе сбрасываем activeCompanyId
        setActiveCompanyId(null);
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
                    <Button 
                        label='Выход' 
                        variant='white' 
                        style={{ width: '85px', height: '32px' }} 
                        icon={<img src={logOut} alt="logOut" />} 
                        styleLabel={{ color: '#14151A', fontSize: '14px', fontWeight: '500' }} 
                    />
                </div>
                <div className={s.titleDiv}>
                    <h2>Новая заявка</h2>
                    <Button 
                        label='Отправить заявку' 
                        icon={<img src={leadIcon} alt="leadIcon" />} 
                        variant='purple' 
                        style={{ width: '185px', height: '40px' }}
                        onClick={() => handleSubmit()}
                        // disabled={!selectedSeller || !companyName || !companyInn || checks.length === 0}
                    />
                </div>
                <div className={s.applicationInfo}>
                    <h2 className={s.title2}>Информация о заявке</h2>
                    <div className={s.blocks}>
                        <div className={s.block}>
                            <p className={s.type}>ПОКУПАТЕЛЬ</p>
                            <div className={s.savedCompanies}>
                                <p className={s.heading}>Сохраненные компании</p>
                                <div className={s.list} onMouseDown={handleMouseDown}>
                                    {savedCompaniesLoading ? (
                                        <div className={s.loading}>Загрузка...</div>
                                    ) : savedCompanies.length > 0 ? (
                                        savedCompanies.map((company) => (
                                            <div
                                                key={company.id}
                                                className={`${s.company} ${activeCompanyId === company.id ? s.active : ''}`}
                                                onClick={() => handleSavedCompanySelect(company)}
                                            >
                                                <h6>{company.name}</h6>
                                                <p>ИНН {company.inn}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={s.noCompanies}>
                                            Нет сохраненных компаний
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={s.orDiv}>
                                <div className={s.line}></div>
                                <div className={s.orText}>или</div>
                            </div>
                            <div className={s.inputs}>
                                <Input 
                                    value={companyName} 
                                    onChange={(e) => handleCompanyFieldChange('name', e.target.value)} 
                                    label='Название компании' 
                                    placeholder='Введите название компании' 
                                />
                                <Input 
                                    value={companyInn} 
                                    onChange={(e) => handleCompanyFieldChange('inn', e.target.value)} 
                                    label='ИНН' 
                                    placeholder='Введите ИНН' 
                                />
                            </div>
                            <div className={s.checkBox}>
                                {canSaveCompanies ? (
                                    <>
                                        <CheckBox 
                                            isChecked={saveCompany} 
                                            setChecked={() => setSaveCompany(!saveCompany)}
                                            disabled={activeCompanyId !== null} // Блокируем если выбрана сохраненная компания
                                        />
                                        <p 
                                            onClick={() => !activeCompanyId && setSaveCompany(!saveCompany)}
                                            className={activeCompanyId ? s.disabled : ''}
                                        >
                                            {activeCompanyId 
                                                ? 'Компания уже сохранена' 
                                                : 'Сохранить компанию в системе'
                                            }
                                        </p>
                                    </>
                                ) : (
                                    <p className={s.noPermission}>
                                        У вас нет прав на сохранение компаний
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={s.block}>
                            <p className={s.type}>ПРОДАВЕЦ</p>
                            <SellerSelect
                                value={selectedSeller}
                                onChange={handleSellerChange}
                                sellers={sellers}
                                error={sellerError}
                            />
                            <Input
                                label="ИНН продавца"
                                value={sellerInn}
                                disabled
                            />
                        </div>
                    </div>

                </div>
                <div className={s.checks}>
                    {!hasChecks ? (
                        <div className={s.block}>
                            <CardBox />
                            <h2 className={s.titlte213}>Пока что тут нет чеков</h2>
                            <p className={s.deskripua}>Для добавления нажмите на кнопку ниже</p>
                            <div className={s.button1}>
                            <Button 
                                label='Добавить чек' 
                                variant='purple' 
                                style={{ width: '100%', height: '40px', marginTop: '16px' }} 
                                styleLabel={{ fontSize: '14px', fontWeight: '500' }}
                                onClick={() => {
                                    setEditingCheck(undefined);
                                    setIsAddCheckModalOpen(true);
                                }}
                            />
                            </div>
                        </div>
                    ) : (
                        <ClientChecksTable 
                            data={checks}
                            onDelete={handleDeleteCheck}
                            onEdit={handleEditCheck}
                            onViewModeChange={setViewMode}
                            onAddCheck={() => {
                                setEditingCheck(undefined);
                                setIsAddCheckModalOpen(true);
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ClientMain
