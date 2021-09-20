import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import axios from 'axios';
/* components */
import { Spot } from '../components/Spot';
/* styles */
import styles from '../styles/SpotDetailScreen.module.css';
/* material ui */
import { Typography, Divider, Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PanToolIcon from '@material-ui/icons/PanTool';
import { makeStyles } from '@material-ui/core/styles';
/* config */
import { config } from '../config/Config';

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

const SpotDetailScreen: React.FC = () => {
  /* styles */
  const classes = useStyles();
  /* useLocation */
  const location = useLocation<any>();
  /* useHistory */
  const history = useHistory();
  /* locationで渡されるデータ */
  const recvData: any = location.state;
  /* データをSpot型にキャストする */
  const spotData: Spot = recvData.spotData;
  /* state */
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

  /* 戻るボタン */
  const onClickBackButton = () => {
    history.goBack();
  }

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

  return(
    <div className={styles.detailView}>

      <div className={styles.spotTitleBlock}>
        <Typography variant="h5" className={styles.spotTitle}>
          {spotData.title}
        </Typography>
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.imageView}>
        {(spotData.thumbnail) && (
          <img
            src={spotData.thumbnail}
            alt=""
            className={styles.previewImg}
          />
        )}
        {(spotData.sub_image_1) && (
          <img
            src={spotData.sub_image_1}
            alt=""
            className={styles.previewImg}
          />
        )}
        {(spotData.sub_image_2) && (
          <img
            src={spotData.sub_image_2}
            alt=""
            className={styles.previewImg}
          />
        )}
  
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.detailArea}>
        {spotData.detail}
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.spotInfo}>
        <div className={styles.info}>
          場所：{spotData.place}
        </div>
        <div className={styles.info}>
          現在状況：<span className={styles.status}>{spotData.status}</span>
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

      <div className={styles.buttonArea}>      
        <Button onClick={onClickBackButton} variant="contained" color="primary" className={styles.bottomButton} >
          <ArrowBackIcon className={styles.buttonIcon} fontSize="small" />
          <span>戻る</span>
        </Button>
      </div>

    </div>
  )
}

export default SpotDetailScreen;