import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Navigate } from 'react-router-dom';
import s from './access-section.module.scss'
import { Attention, Attention2, Plus } from '../../../../components/svgs/svgs'
import Button from '../../../../components/ui/button/button'
import EditAdminModal from '../../../../components/modals/edit-admin-modal/edit-admin-modal'
import DeleteUserModal from '../../../../components/modals/delete-user-modal/delete-user-modal'
import PageTitle from '../../../../components/ui/page-title/page-title'
import AccessTable from '../../../../components/tables/access-table/access-table'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../../../store/slices/adminSlice'
import { useNotification } from '../../../../contexts/NotificationContext/NotificationContext'
import Loader from '../../../../components/ui/loader/loader'
import AccessDenied from '../../../../components/access-denied/access-denied'

const AccessSection = () => {
    const dispatch = useAppDispatch();
    const { addNotification } = useNotification();
    const { admins, currentAdmin, isLoading } = useAppSelector(state => state.admin);
    const [isWarningOpen, setIsWarningOpen] = useState(true);
    const [isChangeUserInfo, setIsChangeUserInfo] = useState(false);
    const [isDeleteUser, setIsDeleteUser] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const loadData = async () => {
            try {
                if (currentAdmin?.isSuperAdmin && admins.length === 0) {
                    await dispatch(getAllAdmins()).unwrap();
                }
            } catch (error: any) {
                addNotification(error.message || 'Ошибка загрузки данных', 'error');
            }
        };

        loadData();
    }, [dispatch, addNotification, currentAdmin?.isSuperAdmin, admins.length]);

    // Проверка на суперадмина перед рендерингом контента
    if (!currentAdmin?.isSuperAdmin) {
        return <AccessDenied />;
    }

    const handleAddAccess = useCallback(() => {
        setCurrentUser(null);
        setIsChangeUserInfo(true);
    }, []);

    const handleEditSubmit = useCallback(async (data: { name: string; login: string; password: string }) => {
        try {
            if (currentUser) {
                const updatedAdmin = await dispatch(updateAdmin({ 
                    adminId: currentUser.id, 
                    data 
                })).unwrap();
                addNotification('Администратор успешно обновлен', 'success');
                setIsChangeUserInfo(false);
            } else {
                const newAdmin = await dispatch(createAdmin(data)).unwrap();
                addNotification('Администратор успешно создан', 'success');
                setIsChangeUserInfo(false);
            }
        } catch (error: any) {
            addNotification(error.message || 'Произошла ошибка', 'error');
            throw error;
        }
    }, [currentUser, dispatch, addNotification]);

    const handleDelete = useCallback(async () => {
        if (!currentUser) return;
        
        try {
            if (!currentAdmin?.isSuperAdmin) {
                addNotification('Только суперадмин может удалять администраторов', 'error');
                return;
            }

            if (currentAdmin.id === currentUser.id) {
                addNotification('Нельзя удалить свой аккаунт', 'error');
                return;
            }

            const result = await dispatch(deleteAdmin(currentUser.id)).unwrap();
            if (result) {
                addNotification('Администратор успешно удален', 'success');
                setIsDeleteUser(false);
            }
        } catch (error: any) {
            addNotification(error.message || 'Произошла ошибка удаления', 'error');
        }
    }, [currentUser, currentAdmin, dispatch, addNotification]);

    // Мемоизируем опции меню для каждой строки
    const getRowMenuOptions = useCallback((row: any) => {
        const options = [];
        
        // Опция редактирования доступна всем для своего аккаунта
        // или суперадмину для всех аккаунтов
        if (currentAdmin?.isSuperAdmin || currentAdmin?.id === row.id) {
            options.push({
                id: 'edit',
                label: 'Редактировать пользователя',
                onClick: () => {
                    const adminData = admins.find(admin => admin.id === row.id);
                    setCurrentUser(adminData);
                    setIsChangeUserInfo(true);
                },
                color: '#F48E2F'
            });
        }

        // Опция удаления доступна только суперадмину и нельзя удалить самого себя
        if (currentAdmin?.isSuperAdmin && currentAdmin.id !== row.id) {
            options.push({
                id: 'delete',
                label: 'Удалить пользователя',
                onClick: () => {
                    setCurrentUser(row);
                    setIsDeleteUser(true);
                },
                color: '#E6483D'
            });
        }

        return options;
    }, [admins, currentAdmin]);

    // Мемоизируем данные для таблицы
    const tableData = useMemo(() => 
        admins.map(admin => ({
            id: admin.id,
            name: admin.name,
            login: admin.login,
            password: admin.password,
            registrationDate: new Date(admin.createdAt).toLocaleDateString()
        })),
        [admins]
    );

    if (isWarningOpen) {
        return (
            <div className={s.warningWrapper}>
                <div className={s.warningContent}>
                    <Attention2 />
                    <h1 className={s.warningTitle}>Внимание! Здесь выдаётся доступ в <span>панель администратора</span></h1>
                    <p className={s.warningDescription}>Это значит, что если вы выдадите доступ из этого раздела, то <span>пользователь может получить доступ ко всем заявкам и данным клиентов омпаний.</span> Если вы хотите зарегистрировать клиента, перейдите в раздел "Клиенты".</p>
                    <div className={s.warningButtons}>
                        <button onClick={() => setIsWarningOpen(false)} className={`${s.warningButton} ${s.warningButtonRed}`}>Открыть раздел</button>
                        <button className={`${s.warningButton} ${s.warningButtonWhite}`}>Закрыть</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={s.accessSection}>
            <div className={s.pagetitile}>
                <PageTitle 
                    responsive_name='Доступы' 
                    responsive_btns={[{text: 'Регистрация', onClick: handleAddAccess}]}
                />
            </div>
            
            <EditAdminModal 
                isOpened={isChangeUserInfo} 
                setOpen={setIsChangeUserInfo} 
                defaultValue={currentUser ? {
                    id: currentUser.id,
                    name: currentUser.name,
                    login: currentUser.login,
                    password: currentUser.password
                } : {
                    name: '',
                    login: '',
                    password: ''
                }}
                isCreating={!currentUser}
                onSubmit={handleEditSubmit}
            />
            
            <DeleteUserModal 
                isOpened={isDeleteUser} 
                setOpen={setIsDeleteUser} 
                isBlocking={true}
                name={currentUser?.name || ''} 
                customTexts={{
                    title: `Вы уверены, что хотите удалить пользователя ${currentUser?.name || ''}?`,
                    description: 'Пользователь потеряет доступ к панели администратора. Это действие необратимо.',
                    buttonLabel: 'Удалить'
                }}
                customDelete={handleDelete}
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

            {isLoading ? (
                <div className={s.tableLoader}>
                    <Loader />
                </div>
            ) : (
                <AccessTable
                    data={tableData}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    getRowMenuOptions={getRowMenuOptions}
                />
            )}
        </div>
    );
};

export default AccessSection;
