import React, { useState, useCallback } from 'react'
import s from './access-section.module.scss'
import { Attention, Attention2, Plus, DetailedAvatar, FilterButton as FilterIcon } from '../../../../components/svgs/svgs'
import Button from '../../../../components/ui/button/button'
import RowMenu from '../../../../components/ui/row-menu/row-menu'
import EditAdminModal from '../../../../components/modals/edit-admin-modal/edit-admin-modal'
import DeleteUserModal from '../../../../components/modals/delete-user-modal/delete-user-modal'
import FilterBottomSheet from '../../../../components/modals/filter-bottom-sheet/filter-bottom-sheet'
import PageTitle from '../../../../components/ui/page-title/page-title'
import AccessTable from '../../../../components/tables/access-table/access-table'

// Добавим моковые данные для примера
const adminUsers = [
    { 
        id: 1, 
        name: 'Иванов Иван', 
        login: 'ivanov@mail.ru',
        password: '12345678',
        registrationDate: '12.03.2024' 
    },
    { 
        id: 2, 
        name: 'Петров Петр', 
        login: 'petrov@mail.ru',
        password: '87654321',
        registrationDate: '15.03.2024' 
    },
]

const AccessSection = () => {
    const [isWarningOpen, setIsWarningOpen] = useState(true)
    const [isChangeUserInfo, setIsChangeUserInfo] = useState(false)
    const [isDeleteUser, setIsDeleteUser] = useState(false)
    const [currentUser, setCurrentUser] = useState<typeof adminUsers[0] | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        date: { start: '', end: '' },
        users: [],
        status: '',
        companies: [],
        sellers: []
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleMobileFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    const getRowMenuOptions = (row: typeof adminUsers[0]) => [
        {
            id: 'edit',
            label: 'Редактировать пользователя',
            onClick: () => {
                setCurrentUser(row)
                setIsChangeUserInfo(true)
            },
            color: '#F48E2F'
        },
        {
            id: 'delete',
            label: 'Удалить пользователя',
            onClick: () => {
                setCurrentUser(row)
                setIsDeleteUser(true)
            },
            color: '#E6483D'
        }
    ]

    const handleAddAccess = () => {
        setCurrentUser(null)
        setIsChangeUserInfo(true)
    }

    if (isWarningOpen) {
        return (
            <div className={s.warningWrapper}>
                <div className={s.warningContent}>
                    <Attention2 />
                    <h1 className={s.warningTitle}>Внимание! Здесь выдаётся доступ в <span>панель администратора</span></h1>
                    <p className={s.warningDescription}>Это значит, что если вы выдадите доступ из этого раздела, то <span>пользователь может получить доступ ко всем заявкам и данным клиентов омпаний.</span> Если вы хотите зарегистрировать клиента, перейдите в раздел “Клиенты”.</p>
                    <div className={s.warningButtons}>
                        <button onClick={() => setIsWarningOpen(false)} className={`${s.warningButton} ${s.warningButtonRed}`}>Открыть раздел</button>
                        <button className={`${s.warningButton} ${s.warningButtonWhite}`}>Закрыть</button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={s.accessSection}>
            <div className={s.pagetitile}><PageTitle responsive_name='Доступы' responsive_btns={[{text: 'Регистрация', onClick: handleAddAccess}]}/></div>
            <EditAdminModal 
                isOpened={isChangeUserInfo} 
                setOpen={setIsChangeUserInfo} 
                defaultValue={currentUser ? {
                    name: currentUser.name,
                    login: currentUser.login,
                    password: currentUser.password
                } : {
                    name: '',
                    login: '',
                    password: ''
                }}
                isCreating={!currentUser}
            />
            <DeleteUserModal 
                isOpened={isDeleteUser} 
                setOpen={setIsDeleteUser} 
                isBlocking={true}
                name={currentUser?.name || ''} 
                customTexts={{
                    title: `Вы уверены, что хотите удалить пользователя ${currentUser?.name || ''}?`,
                    description: 'Пользователь потеряет доступ к панели администратора. Чтобы восстановить доступ, зарегистрируйте заново.',
                    buttonLabel: 'Удалить'
                }}
            />
            <FilterBottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={handleMobileFilterChange}
                onDateChange={() => {}}
                onSumChange={() => {}}
                hideClientFilter={true}
                hideStatusFilter={true}
            />
            <div className={s.accessSectionHeader}>
                <h1>Доступы в панель администратора</h1>
                <Button 
                    label='Выдать доступ' 
                    icon={<Plus />} 
                    styleLabel={{ fontSize: '14px' }}
                    style={{ width: "160px", height: "32px" }} 
                    onClick={handleAddAccess}
                />
            </div>
            <div className={s.attention}>
                <Attention />
                <div className={s.attentionContent}>
                    <h1>Этот раздел предназначен только для выдачи доступа в панель администратора</h1>
                    <p>Это значит, что если вы выдадите доступ из этого раза, то пользователь может получить доступ ко всем данным из панели администратора, в том числе к заявкам и данным компаний. Если вы хотите зарегистрировать клиента, перейдите в раздел "Клиенты".</p>
                </div>
                <button className={s.attentionButton}>Перейти в раздел "Клиенты"</button>
            </div>

            <AccessTable
                data={adminUsers}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                getRowMenuOptions={getRowMenuOptions}
            />
        </div>
    )
}

export default AccessSection
