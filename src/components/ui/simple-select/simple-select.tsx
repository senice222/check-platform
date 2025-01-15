import React, { useState, useRef, useEffect } from 'react';
import styles from './simple-select.module.scss';
import { ArrowSelect } from '../../svgs/svgs';

interface SimpleSelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{
        value: string;
        label: string;
    }>;
    error?: string;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
    label,
    value,
    onChange,
    options,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.selectWrapper} ref={selectRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.select}>
                <button
                    className={`${styles.selectButton} ${isOpen ? styles.active : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                >
                    <span>{selectedOption?.label || 'Выберите'}</span>
                    <ArrowSelect />
                </button>

                {isOpen && (
                    <div className={styles.dropdown}>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                type="button"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default SimpleSelect; 