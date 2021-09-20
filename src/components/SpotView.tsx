import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
/* components */
import { Spot } from './Spot';
/* styles */
import styles from "../styles/SpotView.module.css";
/* material ui */
import { Divider, IconButton, Button } from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import { makeStyles } from '@material-ui/core/styles';
/* config */
import { config } from '../config/Config';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

/* styleの設定 */
const useStyles = makeStyles({
  agreeIconFalse: {
    width: 30,
    height: 30,
  },
  agreeIconTrue: {
    color: "red",
    width: 30,
    height: 30,
  }
});

interface Props{
  spotData: Spot;
}

const SpotView: React.FC<Props> = ({spotData}) => {
  /* state */
  const classes = useStyles();
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreed, setAgreed] = useState<number>(spotData.agreed);

  /* useEffect */
  useEffect(() => {
    const localData = localStorage.getItem(spotData.uuid);
    if (localData === null) {
      setIsAgreed(false);
    } else {
      const isAgreedLocal: boolean = JSON.parse(localData).agreed;
      setIsAgreed(isAgreedLocal);
    }
    setAgreed(spotData.agreed);
  },[])

  /* useHistory */
  const history = useHistory();


  /* 詳細画面へ飛ぶ */
  const onClickDetailButton = () => {
    history.push({
      pathname: "/civ/detail",
      state: {spotData: spotData}
    })
  };

  /* 賛成ボタンの処理 */
  const onClickAgreed = () => {
    isAgreed ? setAgreed(agreed-1) : setAgreed(agreed+1);
    setIsAgreed(!isAgreed);
    const data = {agreed: !isAgreed};
    const url: string= config.spotPatchUrl + spotData.uuid;
    axios.patch(url, data)
         .then(res => {
           console.log("Sucusess");
           console.log(res.data);
         }).catch(err => {
           console.log("Failed");
           console.log(err.data);
         });
    /* localStorageに保存 */
    localStorage.setItem(spotData.uuid, JSON.stringify(data));
  };

  return (
    <div className={styles.view}>
      <div className={styles.box}>
        <div className={styles.photoPreviewArea}>
          <div className={styles.photoView}>
            <img 
              src = {spotData.thumbnail} 
              alt=""
              className={styles.previewImg} 
            />
          </div>
        </div>
        <div>
          <div className={styles.title}>
            { spotData.title }
          </div>
          <Divider variant="middle" className={styles.divider} />
          <div className={styles.place}>
            { spotData.place }
          </div>
          <div className={styles.status}>
            現在状況：<span className={styles.statusStyle}>{spotData.status}</span>
          </div>
        </div>

        <div className={styles.agreeView}>
          <IconButton onClick={onClickAgreed} className={styles.agreeButton}>
            {isAgreed ? <PanToolIcon className={classes.agreeIconTrue}/> : <PanToolIcon className={classes.agreeIconFalse}/>}
          </IconButton>
          <div className={styles.agreeLabel}>
            { agreed }
          </div>
          <div className={styles.agreeTitle}>
            そう思う!
          </div>
        </div>

        <Divider variant="middle" className={styles.divider} />

        <div className={styles.detailBlock}>
            <Button 
              className={styles.detailButton}
               onClick={onClickDetailButton}
            >
              <span className={styles.detailButtonLabel}>詳細→</span>
            </Button>
        </div>
        
      </div>
    </div>
  )
}

export default SpotView;