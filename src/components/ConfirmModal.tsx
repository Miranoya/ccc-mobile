import React, {useState} from 'react';
/* styles */
import styles from '../styles/ConfirmModal.module.css';

interface Props {
  modalIsOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ConfirmModal: React.FC<Props> = ({
  modalIsOpen,
  setIsOpen
}) => {
  const label: string[] =["10代", "20代", "30代", "40代", "50代", "60代", "70代", "80代", "回答しない"]
  const setUserInfo = (infoNum: number) => {
    localStorage.setItem("userInfo", String(infoNum));
    console.log(localStorage.getItem("userInfo"));
    setIsOpen(false);
  };
  return(
    <div className={styles.modalView}>
      {(() =>{
        const items = [];
        for (let i = 0; i < label.length; i++) {
          items.push(
            <button 
              className={styles.button} 
              onClick={() => setUserInfo(i)}
            >{label[i]}
            </button>
            )
        }
        return <div>{items}</div>
      })()}
    </div>
  )
}

export default ConfirmModal;