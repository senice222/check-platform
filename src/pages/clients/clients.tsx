import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import s from './clients.module.scss'
import Button from '../../components/ui/button/button'
import { Plus, DetailedAvatar, SearchIcon, TableIcon, CardIcon, ClientAvatar } from '../../components/svgs/svgs'
import RowMenu from '../../components/ui/row-menu/row-menu'
import AddClientModal from '../../components/modals/add-client-modal/add-client-modal';
import ChangeUserInfoModal from '../../components/modals/change-user-info-modal/change-user-info-modal';
import DeleteUserModal from '../../components/modals/delete-user-modal/delete-user-modal';
import SearchBottomSheet from '../../components/modals/search-bottom-sheet/search-bottom-sheet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getAllClients, deleteClient } from '../../store/slices/clientSlice';
import { useNotification } from '../../contexts/NotificationContext/NotificationContext';
import StatusBadge from '../../components/ui/status-badge/status-badge';

interface Client {
    _id: string;
    name: string;
    key: string;
    canSave: boolean;
    isBlocked: boolean;
    createdAt: string;
    activeApplications: number;
    totalApplications: number;
    registrationDate: string;
}

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  const { clients, isLoading } = useAppSelector(state => state.client);
  console.log(clients,11)
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isChangeUserInfo, setIsChangeUserInfo] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  console.log(clients, 11)
  useEffect(() => {
    const loadClients = async () => {
      try {
        await dispatch(getAllClients()).unwrap();
      } catch (error: any) {
        addNotification(error.message || 'Ошибка при загрузке клиентов', 'error');
      }
    };

    loadClients();
  }, [dispatch, addNotification]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = useMemo(() => {
    if (!clients) return [];
    return clients.filter((client: Client) =>
        client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  const handleDeleteClient = async () => {
    if (!currentUser) return;
    console.log(currentUser);
    try {
      await dispatch(deleteClient(currentUser._id)).unwrap();
      addNotification('Клиент успешно удален', 'success');
      setIsDeleteUser(false);
      setCurrentUser(null);
    } catch (error: any) {
      addNotification(error.message || 'Ошибка при удалении клиента', 'error');
    }
  };

  const getRowMenuOptions = (client: any) => [
    {
      id: 'profile',
      label: 'Профиль клиента',
      onClick: () => navigate(`/admin/detailed-client/${client._id}`)
    },
    {
      id: 'applications',
      label: 'Заявки клиента',
      onClick: () => navigate(`/admin/detailed-client/${client._id}`)
    },
    {
      id: 'edit',
      label: 'Редактировать клиента',
      onClick: () => {
        setCurrentUser(client);
        setIsChangeUserInfo(true);
      }
    },
    {
      id: 'link',
      label: 'Ссылка на вход для клиента',
      onClick: () => {
        console.log(client, 12)
        const link = `${window.location.origin}/client/login/${client.key}`;
        navigator.clipboard.writeText(link)
          .then(() => addNotification('Ссылка скопирована', 'success'))
          .catch(() => addNotification('Ошибка при копировании', 'error'));
      }
    },
    {
      id: 'block',
      label: client.isBlocked ? 'Разблокировать клиента' : 'Удалить клиента',
      onClick: () => {
        console.log(213)
        setCurrentUser(client);
        setIsDeleteUser(true);
      },
      danger: true
    }
  ];

  const renderCard = (row: any) => (
    <div  className={s.card} key={row.id}>
      <div className={s.cardBody}>
        <div className={s.header_clients}>
          <div onClick={() => navigate(`/admin/detailed-client/${111}`)} className={s.userCell}>
            <ClientAvatar />
            <div className={s.userInfo}>
              <span className={s.userName}>{row.name}</span>
              {row.isBlocked && (
                <StatusBadge 
                  customStatus={{
                    label: 'Заблокировано',
                    type: 'blocked'
                  }}
                />
              )}
            </div>
          </div>
          <div className={s.cardActions}>
            <RowMenu options={getRowMenuOptions(row)} />
          </div>
        </div>
        <div className={s.cardInfo}>
          <div className={s.top}>
            <div className={s.infoRow}>
              <span className={s.label}>Активных заявок:</span>
              <span className={s.value}>{row.activeApplications}</span>
            </div>
            <div className={s.infoRow}>
              <span className={s.label}>Всего заявок:</span>
              <span className={s.value}>{row.totalApplications}</span>
            </div>
          </div>
          <div className={s.infoRow}>
            <span className={s.label}>Дата регистрации:</span>
            <span className={s.value}>{row.registrationDate}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={s.clients}>
      <AddClientModal isOpened={isCreating} setOpen={setIsCreating} />
      <ChangeUserInfoModal 
        isOpened={isChangeUserInfo} 
        setOpen={setIsChangeUserInfo} 
        defaultValue={currentUser?.name || ''} 
        clientId={currentUser?._id || ''}
        canSave={currentUser?.canSave}
      />
      <DeleteUserModal 
        isOpened={isDeleteUser} 
        setOpen={setIsDeleteUser} 
        isBlocking={currentUser?.isBlocked}
        name={currentUser?.name || ''} 
        clientId={currentUser?._id || ''}
      />
      <div className={s.clients_header}>
        <h1>Клиенты</h1>
        <Button
          variant='purple'
          label='Зарегистрировать нового клиента'
          icon={<Plus />}
          onClick={() => setIsCreating(true)}
          style={{ width: '285px', height: '32px' }}
          styleLabel={{ fontSize: '14px' }}
        />
      </div>

      {isMobile && (
        <div className={s.mobileControls}>
          <div className={s.leftControls}>
            <button onClick={() => setIsSearchOpen(true)}>
              <SearchIcon />
            </button>
          </div>
          <div className={s.viewToggle}>
            <button
              className={`${s.toggleButton} ${viewMode === 'table' ? s.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              <TableIcon />
            </button>
            <button
              className={`${s.toggleButton} ${viewMode === 'cards' ? s.active : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <CardIcon />
            </button>
          </div>
        </div>
      )}

      <SearchBottomSheet<any>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        data={clients}
        renderCard={renderCard}
        filterFunction={(item, query) => 
          item?.name?.toLowerCase().includes(query.toLowerCase()) || false
        }
        emptyStateText={{
          title: 'Это поиск клиентов',
          description: 'Здесь можно искать клиентов по их имени.',
          searchTitle: 'Ничего не найдено',
          searchDescription: 'Клиентов с таким именем нет. Проверьте ваш запрос или зарегистрируйте нового клиента.'
        }}
      />

      <div className={s.tableContainer} data-view-mode={viewMode}>
        {(showSearch || !isMobile) && (
          <div className={s.searchWrapper}>
            <span className={s.icon}>
              <SearchIcon />
            </span>
            <input
              className={s.search}
              type="text"
              placeholder="Поиск по клиентам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <table className={s.table} data-view-mode={viewMode}>
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Пользователь</th>
              <th>Активных заявок</th>
              <th>Всего заявок</th>
              <th>Дата регистрации</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr  key={row.id}>
                <td>
                  <div onClick={() => navigate(`/admin/detailed-client/${row._id}`)} className={s.userCell}>
                    <DetailedAvatar />
                    <div className={s.userInfo}>
                      <span className={s.userName}>{row.name}</span>
                      {row.isBlocked && (
                        <StatusBadge 
                          customStatus={{
                            label: 'Заблокировано',
                            type: 'blocked'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td>{row.activeApplications}</td>
                <td>{row.totalApplications}</td>
                <td>{row.registrationDate}</td>
                <td>
                  <RowMenu client={row} options={getRowMenuOptions(row)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={s.cardsContainer} data-view-mode={viewMode}>
          {filteredData.map(row => renderCard(row))}
        </div>
      </div>
    </div>
  )
}

export default Clients
