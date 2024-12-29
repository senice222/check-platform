import React from 'react';
import styles from './sellers-search-bottom-sheet.module.scss';
import Modal from '../../ui/modal/modal';
import { SearchIcon } from '../../svgs/svgs';
import { SellerData } from '../../tables/sellers-table/sellers-table';

interface SellersSearchBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sellers: SellerData[];
}

const SellersSearchBottomSheet: React.FC<SellersSearchBottomSheetProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  sellers
}) => {
  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.inn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal 
      isOpened={isOpen} 
      setOpen={onClose} 
      title="Поиск"
    >
      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по продавцам"
            className={styles.searchInput}
            autoFocus
          />
        </div>
        <div className={styles.results}>
          {filteredSellers.map((seller) => (
            <div key={seller.id} className={styles.sellerItem}>
              <div className={styles.sellerInfo}>
                <span className={`${styles.sellerName} ${seller.type === 'elite' ? styles.elite : ''}`}>
                  {seller.name}
                </span>
                <span className={styles.inn}>ИНН {seller.inn}</span>
              </div>
              <span className={`${styles.typeBadge} ${styles[seller.type]}`}>
                {seller.type === 'elite' ? 'Элитная' : 'Белая'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SellersSearchBottomSheet; 