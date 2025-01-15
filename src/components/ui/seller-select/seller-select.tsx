import React from 'react';
import SimpleSelect from '../simple-select/simple-select';

interface Seller {
    id: string;
    name: string;
    inn: string;
    type: 'elite' | 'white';
}

interface SellerSelectProps {
    value: string;
    onChange: (sellerId: string, sellerInn: string) => void;
    sellers: Seller[];
    error?: string;
}

const SellerSelect: React.FC<SellerSelectProps> = ({ 
    value, 
    onChange, 
    sellers,
    error 
}) => {
    const handleSellerChange = (sellerId: string) => {
        const selectedSeller = sellers.find(seller => seller.id === sellerId);
        if (selectedSeller) {
            onChange(sellerId, selectedSeller.inn);
        }
    };

    const options = sellers.map(seller => ({
        value: seller.id,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div>
                    <span style={{ fontSize: '14px' }}>{seller.name}</span>
                    <span style={{ 
                        color: '#0F132499', 
                        marginLeft: '8px',
                        fontSize: '12px'
                    }}>
                        ИНН {seller.inn}
                    </span>
                </div>
                {seller.type === 'elite' && (
                    <span style={{
                        backgroundColor: '#F5EBFF',
                        color: '#924FE8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        Элитная
                    </span>
                )}
            </div>
        )
    }));

    return (
        <SimpleSelect
            label="Продавец"
            value={value}
            onChange={handleSellerChange}
            options={options}
            error={error}
            placeholder="Выберите продавца"
        />
    );
};

export default SellerSelect; 