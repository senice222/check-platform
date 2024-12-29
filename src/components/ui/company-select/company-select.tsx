import React, { FC, useState, useEffect } from 'react';
import s from './company-select.module.scss';
import { ArrowSelect } from '../../svgs/svgs';

interface Company {
    id: number;
    name: string;
    inn: string;
}

interface CompanySelectProps {
    companies: Company[];
    selectedCompany: Company | null;
    onSelect: (company: Company) => void;
    label?: string;
}

const CompanySelect: FC<CompanySelectProps> = ({
    companies,
    selectedCompany,
    onSelect,
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(`.${s.companySelect}`)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={s.selectWrapper}>
            {label && <label className={s.label}>{label}</label>}
            <div className={s.companySelect}>
                <div 
                    className={s.trigger} 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedCompany ? (
                        <div className={s.selectedCompany}>
                            <span className={s.companyName}>{selectedCompany.name}</span>
                            <span className={s.companyInn}>ИНН {selectedCompany.inn}</span>
                        </div>
                    ) : (
                        <span className={s.placeholder}>Выберите компанию</span>
                    )}
                    <ArrowSelect className={`${s.arrow} ${isOpen ? s.open : ''}`} />
                </div>
                {isOpen && (
                    <div className={s.dropdown}>
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className={s.option}
                                onClick={() => {
                                    onSelect(company);
                                    setIsOpen(false);
                                }}
                            >
                                <span className={s.companyName}>{company.name}</span>
                                <span className={s.companyInn}>ИНН {company.inn}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanySelect; 