import React, { FC } from 'react';
import s from './cancel-application.module.scss';
import Modal from '../../ui/modal/modal';
import Button from '../../ui/button/button';

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  setEditing: () => void;
}

const CancelApplication: FC<Props> = ({ isOpened, setOpen }) => {
  return (
    <Modal setOpen={setOpen} isOpened={isOpened}>
      {/* Содержимое модального окна */}
      <div className={s.content}>
        <h1>Вы уверены, что хотите отменить изменение заявки?</h1>
        <p className={s.desk}>Внесённые изменения не сохранятся.</p>
        <div className={s.actions}>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500'}} variant='white' label='Закрыть' onClick={() => setOpen(false)}/>
          <Button style={{width: '172px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500', color: 'white'}} variant='purple' label='Отменить изменения'/>
        </div>
      </div>
    </Modal>
  );
};

export default CancelApplication;
